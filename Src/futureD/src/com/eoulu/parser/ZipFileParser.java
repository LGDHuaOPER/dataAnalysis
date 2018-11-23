/**
 * 
 */
package com.eoulu.parser;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.imageio.ImageIO;

import org.apache.tools.ant.taskdefs.Zip;

import com.eoulu.dao.ParameterDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.entity.MapParameterDO;
import com.eoulu.exception.ExceptionLog;
import com.eoulu.service.ReadPMSFileService;
import com.eoulu.service.WaferService;
import com.eoulu.service.impl.WaferServiceImpl;
import com.eoulu.transfer.FileFilterTool;
import com.eoulu.transfer.ProgressSingleton;
import com.eoulu.util.DataBaseUtil;
import com.eoulu.util.FileUtil;



/**
 * @author mengdi
 *
 * 
 */
public class ZipFileParser {
	
	private static boolean fileType = false;
	
	public static ArrayList<String> filelist = new ArrayList<String>();
	// zip压缩文件中 上传失败的CSV文件,map文件 和 excel文件
	public static ArrayList<String> faileCSV = new ArrayList<String>();
	// 存放map的晶圆编号和路径
	public static Map<String, Object> mapfilelist = new HashMap<String, Object>();
	// 存放map的晶圆编号和路径
	public Map<String, Object> excelfilelist = new HashMap<String, Object>();
	// CSV总个数
	public static int CSVnum = 0;
	// Map总个数
	public static int Mapnum = 0;
	// Excel总个数
	public static int Excelnum = 0;
	private static String logWafer = "";

	public static Map<String, Object> Zip(Map<String,Object> map ) {
		StringBuffer errorFile = new StringBuffer("");// 错误格式文件
		String filename = "";// 上传失败的CSV、Map、Excel文件名
		String status = "",
				 filePath = map.get("filePath")==null?"":map.get("filePath").toString(), 
				 temp = map.get("temp")==null?"":map.get("temp").toString(),  
				 filename2 = map.get("fileName")==null?"":map.get("fileName").toString(), 
				 dataFormat = map.get("dataFormat")==null?"0":map.get("dataFormat").toString(), sessionId = map.get("sessionId")==null?"":map.get("sessionId").toString();
		int interval = Integer.parseInt(map.get("interval")==null?"0":map.get("interval").toString()), filternum = 1;// 标志先导入map文件和CSV文件
		Map<String, Object> resultMap = new HashMap<String, Object>();
		ProgressSingleton.put(sessionId, interval+=5);
		// 用户上传的是一个压缩包
		// 若是一个文件夹。
		File file1 = null;
		if(filePath.endsWith(".zip")){
			file1 = FileUtil.unZip(filePath, temp + "\\" + filename2);
		}
		if(filePath.endsWith(".rar")){
			file1 = FileUtil.unRar(filePath, temp + "\\" + filename2);
		}
		System.out.println(file1.getName());
//		if ("0".equals(dataFormat)) {
//			resultMap.put("flag", false);
//			
//			return resultMap;
//		}
		ProgressSingleton.put(sessionId, interval+=5);
		ReadPMSFileService pmsService = new ReadPMSFileService();
		if(pmsService.isContains(file1.getAbsolutePath(), "pms")){
//			status = pmsService.getPMSFiles(file1.getAbsolutePath(),  productCategory,currentUser, description, dataFormat, sessionId, interval);
			resultMap.put("status", status);
			return resultMap;
		}
		if(!"0".equals(dataFormat)){
			resultMap.put("status", "文件与数据格式不一致！");
			return resultMap;
		}
		logWafer = "";
		DataBaseUtil db = new DataBaseUtil();
		Connection conn = db.getConnection();
		ProgressSingleton.put(sessionId, interval+=5);
		try {
			conn.setAutoCommit(false);
			map.put("dataFormat", dataFormat);
			// 导入map
			getFiles(conn,file1.getAbsolutePath(),  filternum,map,db);
			ProgressSingleton.put(sessionId, interval+=5);
			map.put("interval",interval);
			// 导入excel文件
			filternum = 2;
			getFiles(conn,file1.getAbsolutePath(), filternum,map,db);
			ProgressSingleton.put(sessionId, interval+=5);
			map.put("interval",interval);
			// 导入CSV文件
			filternum = 3;
			getFiles(conn,file1.getAbsolutePath(),  filternum,map,db);
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	
		for (int i = 0; i < filelist.size(); i++) {
			if (!(filelist.get(i).endsWith(".CSV") || filelist.get(i).endsWith(".csv")
					|| filelist.get(i).endsWith(".zip") || filelist.get(i).endsWith(".map")
					|| filelist.get(i).endsWith(".xlsx") || filelist.get(i).endsWith(".xls"))) {
				errorFile.append(filelist.get(i) + "格式有误,");
			}
		}
		// 上传失败的CSV文件名
		for (int i = 0; i < faileCSV.size(); i++) {
			if (i == faileCSV.size() - 1) {
				filename = filename + faileCSV.get(i);
			} else {
				filename = filename + faileCSV.get(i) + ",";
			}
		}
		boolean flag = CSVnum > 0 || Mapnum > 0 || Excelnum > 0 ? false : true;
		if (!"".equals(filename) || !"".equals(errorFile.toString())) {
			int failnum;// 上传失败的CSV、map、excel个数
			// 包含多个上传失败的文件
			if (filename.contains(",")) {
				String filenames[] = filename.split(",");
				failnum = filenames.length;
			} else {
				// 包含0个上传失败的文件
				if ("".equals(filename)) {
					failnum = 0;
					// 包含1个上传失败的文件
				} else {
					failnum = 1;
				}
			}
			if (failnum == (CSVnum + Mapnum + Excelnum)) {
				status = "全部上传失败：" + filename + "," + errorFile.toString();
			} else {
				status = "部分导入成功，未导入文件有：" + filename + "," + errorFile.toString();
			}
		} else {
			status = "success";
		}
		resultMap.put("flag", flag);// 存在CSV
		resultMap.put("status", status);// 上传失败的CSV文件名
		resultMap.put("logWafer", logWafer);
		return resultMap;
	}

	
	
	static void getFiles(Connection conn,String filePath,
			 int filternum,Map<String,Object> map,DataBaseUtil db) {
		File root = new File(filePath);
		File[] files = root.listFiles();// 获取当前目录下的所有文件与文件夹
		boolean flagDirectory = isExist(files);
		CSV(conn,filePath,   filternum, map,db);
		for (File file : files) {
			if (file.isDirectory()) {
				if (!flagDirectory) {// 没有曲线数据时，才进入向下一级文件夹目录；当前路径下若有文件夹且包含.csv与.map文件，则在读取.csv文件后取读取曲线数据
					getFiles(conn,file.getAbsolutePath(), filternum, map,db);
				}
			} else {
				if (filternum == 1 && !flagDirectory) {
					filelist.add(file.getName());
				}
			}
		}
	}
	

	/**
	 * 曲线数据判断 判断当前路径下是否包含.csv与.map文件，且包含文件夹
	 * 
	 * @param files
	 *            当前路径下的文件
	 * @return
	 */
	public static boolean isExist(File[] files) {

		boolean temp1 = false;
		boolean temp2 = false;
		for (File file : files) {
			if (file.isDirectory()) {// 是目录，但不遍历子目录
				temp1 = true;
			} else {
				String filePath = file.getAbsolutePath();
				int begIndex = filePath.lastIndexOf(".");
				String temp = filePath.substring(begIndex + 1, filePath.length());
				if (temp.equalsIgnoreCase("csv") || temp.equalsIgnoreCase("map")) {
					temp2 = true;
				}
			}
		}
		return temp1 && temp2;
	}

	public static void CSV(Connection conn,String path,int filternum, Map<String,Object> map,DataBaseUtil db) {
		WaferDao fileDao = new WaferDao();
		ParameterDao parameterDao = new ParameterDao();
		File file1 = new File(path);
		FileFilterTool filetool = new FileFilterTool();
		// 上传失败的CSV文件
		String failcsv, status = "",
		 productCategory = map.get("productCategory").toString(),  
				 description = map.get("description").toString(), 
				 currentUser = map.get("currentUser").toString(),
				dataFormat = map.get("dataFormat").toString(),
						sessionId = map.get("sessionId").toString();
		int interval = Integer.parseInt(map.get("interval").toString());
		
		if (filternum == 1) {
			filetool.addType(".map");
		} else if (filternum == 2) {
			filetool.addType(".xlsx");
			filetool.addType(".xls");
		} else if (filternum == 3) {
			filetool.addType(".CSV");
			filetool.addType(".csv");
		}
		File[] files1 = file1.listFiles(filetool);
		int summation = files1.length>0?(95-interval)/files1.length:95-interval;
		for (int i = 0, length = files1.length; i < length; i++) {
			try {
				// zip,调用Zip方法
				if (files1[i].getName().endsWith(".CSV") || files1[i].getName().endsWith(".csv")) {
					CSVnum = CSVnum + 1;
//					 WriteToCsv(files1[i].getAbsolutePath(), (String) mapfilelist.get(waferid));// 把map文件内容写入CSV文件
					long timeCSV = System.currentTimeMillis();
					WaferService service = new WaferServiceImpl();
					status = service.saveZipData(conn,mapfilelist, files1[i].getAbsolutePath(), productCategory, currentUser,
							description, files1[i].getAbsolutePath(),db);
					ProgressSingleton.put(sessionId, interval+=summation);
					// 未找到对应的map文件
					long timeCSV2 = System.currentTimeMillis();
					System.out.println("how long:" + (timeCSV2 - timeCSV));
					failcsv = getReturn(files1[i].getName(), status);
					if (!"success".equals(failcsv)) {
						faileCSV.add(failcsv);
					}
				} else if (files1[i].getName().endsWith(".map")) {
					Mapnum = Mapnum + 1;
					Map<String, Object> resultMap = getMapFile( conn,parameterDao,files1[i].getAbsolutePath());// SaveMapFile(files1[i].getAbsolutePath());
					status = (String) resultMap.get("status");
					if ("success".equals(status)) {
						logWafer = resultMap.get("waferNO").toString();
					}
					failcsv = getReturn(files1[i].getName(), status);
					
					if (!"success".equals(failcsv)) {
						faileCSV.add(failcsv);
					}
				} else if (files1[i].getName().endsWith(".xlsx") || files1[i].getName().endsWith(".xls")) {
					Excelnum = Excelnum + 1;
					String waferid = ExcelParser.getExcelWaferNumber(files1[i].getAbsolutePath());
//					boolean flag2 = fileDao.queryWaferinfo(conn, waferid);
					// excel文件中晶圆编号为空
					if ("上传失败，文件中的晶圆编号为空值！".equals(waferid)) {
						failcsv = getReturn(files1[i].getName(), waferid);
						faileCSV.add(failcsv);
						
						continue;
					}
//					if (flag2) {
//						status = "文件已经上传！";
//						failcsv = getReturn(files1[i].getName(), status);
//						faileCSV.add(failcsv);
//						continue;
//					}
					// 找到对应的map文件
					if (mapfilelist.get(waferid) != null) {
						String CSVname = ExcelParser.readfile(files1[i].getAbsolutePath(),
								(String) mapfilelist.get(waferid));
						if (!(CSVname.contains("WaferID"))) {
							status = CSVname;
							// 导入转换后的CSV文件。
						} else {
							String CSV[] = CSVname.split("\n");
							List<String> filelist = new ArrayList<>();
							for (int j = 0; j < CSV.length; j++) {
								filelist.add(CSV[j]);
							}
							status = ExcelParser.getExcelData(conn,files1[i].getAbsolutePath(), productCategory, description,
									currentUser, dataFormat,sessionId,interval,true);
						}
						// 未找到对应的map文件
					} else {
						status = ExcelParser.getExcelData(conn,files1[i].getAbsolutePath(), productCategory, description,
								currentUser, dataFormat,sessionId,interval,true);
					}
					failcsv = getReturn(files1[i].getName(), status);
					if (!"success".equals(failcsv)) {
						faileCSV.add(failcsv);
					}
				}
//			} catch (SQLException e) {
//				ExceptionLog.printException(e);
//				failcsv = getReturn(files1[i].getName(), "数据库操作异常！");
//				faileCSV.add(failcsv);
//				continue;
			} catch (Exception e) {
				ExceptionLog.printException(e);
				failcsv = getReturn(files1[i].getName(), "未知错误！");
				faileCSV.add(failcsv);
				continue;
			}
		}
	}

	// 判断问题CSV
	public static String getReturn(String filename, String status) {
		String name = "";
		switch (status) {
		case "上传失败，目标文件内容有误！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(内容有误)";
			break;
		// 文件已经上传
		case "文件已经上传！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(已上传)";
			break;
		case "上传失败，文件中的晶圆编号为空值！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(晶圆编号为空)";
			break;
		case "上传失败，文件中缺失编号坐标X轴增长方向！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(缺失编号坐标X轴增长方向)";
			break;
		case "上传失败，文件中缺失编号坐标Y轴增长方向！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(缺失编号坐标Y轴增长方向)";
			break;
		case "上传失败，文件中缺失晶圆图坐标X轴增长方向！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(缺失晶圆图坐标X轴增长方向)";
			break;
		case "上传失败，文件中缺失晶圆图坐标Y轴增长方向！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(缺失晶圆图坐标Y轴增长方向)";
			break;
		case "上传失败，文件中缺失晶圆图参考Die的X坐标！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(缺失晶圆图参考Die的X坐标)";
			break;
		case "上传失败，文件中缺失晶圆图参考Die的Y坐标！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(缺失晶圆图参考Die的Y坐标)";
			break;
		case "上传失败，文件中缺失晶圆图参考Die编号的X坐标！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(缺失晶圆图参考Die编号的X坐标)";
			break;
		case "上传失败，文件中缺失晶圆图参考Die编号的Y坐标！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(缺失晶圆图参考Die编号的Y坐标)";
			break;
		case "上传失败，文件中的测试人员为空值！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(测试人员为空)";
			break;
		case "上传失败，文件中的设备编号为空值！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(设备编号为空)";
			break;
		case "上传失败，文件中的批次编号为空值！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(批次编号为空)";
			break;
		case "上传失败，文件中的DieType存在空值！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(DieType存在空值)";
			break;
		case "上传失败，文件中的DieX存在空值！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(DieX存在空值)";
			break;
		case "上传失败，文件中的DieY存在空值！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(DieY存在空值)";
			break;
		case "上传失败，文件中的Bin值存在空值！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(Bin值存在空值)";
			break;
		// 缺少map文件
		case "上传失败，导入目标文件前没有导入对应的map文件！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(没有map文件)";
			break;
		case "上传失败，文件中参数的上下限填写不完整！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(上下限不完整)";
			break;
		case "上传失败，文件中位置坐标(Coordinate)格式不正确！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(Coordinate格式有误)";
			break;
		case "上传失败，文件中字母坐标格式不正确！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(字母坐标格式有误)";
			break;
		case "上传失败，文件中FileName为空！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(FileName为空)";
			break;
		case "上传失败，文件中TesttotalTime为空！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(TesttotalTime为空)";
			break;
		case "上传失败，文件中参数名称存在空值！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(参数名存在空值)";
			break;
		case "success":
			name = "success";
			break;
		case "重复数据":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(重复数据)";
			break;
		case "上传失败，文件中的Diameter为空值！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(Diameter为空)";
			break;
		case "上传失败，文件中的DieSizeX为空值！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(DieSizeX为空)";
			break;
		case "上传失败，文件中的DieSizeY为空值！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(DieSizeY为空)";
			break;
		case "上传失败，文件中的FlatLength为空值！":
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(FlatLength为空)";
			break;
		default:
			name = filename.substring(filename.lastIndexOf("\\") + 1) + "(其他错误)";
		}
		return name;
	}

	public static String getWaferID(String file) throws IOException {
		String waferid = "";
		boolean flag = true;
		FileInputStream fis = null;
		fis = new FileInputStream(file);
		BufferedReader br = new BufferedReader(new InputStreamReader(fis));
		String line = "";
		while ((line = br.readLine()) != null) {
			if (line.contains("WaferID")) {
				flag = false;
				String WaferIDArray[] = line.split(",");
				if (WaferIDArray.length >= 3 && !"".equals(WaferIDArray[2])) {
					waferid = WaferIDArray[2].trim();// 晶圆ID
				} else {
					waferid = "上传失败，文件中的晶圆编号为空值！";
				}
				break;
			}
		}
		if (flag) {
			waferid = "上传失败，目标文件内容有误！";
		}
		if (fis != null) {
			fis.close();
		}
		return waferid;
	}

	/**
	 * 将无效die 的内容写到csv中 这个是map+csv模式下的内容。
	 * 
	 * @param writepath
	 * @param mapfilepath
	 * @return
	 */
	public static String WriteToCsv(String writepath, String mapfilepath) {
		String s = "";
		Map<String, String> Invalidationdie = new HashMap<String, String>();
		Invalidationdie = GetXYandDieno(mapfilepath, 2);
		StringBuilder sb = new StringBuilder();
		sb.append("\n");// 先换一行
		for (String diexdiey : Invalidationdie.keySet()) {
			String str = diexdiey + "," + Invalidationdie.get(diexdiey);
			// 因为无效die 的编号正好也是-1，Bin也是-1；所以没有去修改了。
			sb.append(str + ",0,-1,0" + "\n");
		}
		String sbs = sb.toString();
		File file = new File(writepath);
		try {
			FileOutputStream out;
			out = new FileOutputStream(file, true);
			try {
				out.write(sbs.getBytes("utf-8"));
				out.close();
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		return s;
	}

	/**
	 * 读取map文件 返回xy坐标 和编号
	 * 
	 * @param filepath
	 * @param v
	 * @return
	 */
	public static Map<String, String> GetXYandDieno(String filepath, int v) {
		Map<String, String> xydieno = new HashMap<String, String>();// 将三个重要信息diex，diey，dieno存到这个list中。
		List<String> contentList = new ArrayList<String>();// 该list是将文件中的内容全部取出
		File file = new File(filepath);
		BufferedReader br = null;
		BufferedReader bs = null;
		FileInputStream fis;
		// BufferedInputStream bs;
		try {
			// bs = new BufferedInputStream(new FileInputStream(file));
			fis = new FileInputStream(file);
			try {
				br = new BufferedReader(new InputStreamReader(fis, "Unicode"), 5 * 1024 * 1024);
				String s = "";
				try {
					while ((s = br.readLine()) != null) {
						contentList.add(s + "\n");
					}
					if (contentList.size() < 10) {
						contentList.removeAll(contentList);
						fis = new FileInputStream(file);
						bs = new BufferedReader(new InputStreamReader(fis, "GBK"), 5 * 1024 * 1024);
						while ((s = bs.readLine()) != null) {
							contentList.add(s + "\n");
						}

					}
				} catch (IOException e) {
					e.printStackTrace();
				}
				try {
					br.close();
					if (bs != null) {
						bs.close();
					}

				} catch (IOException e) {
					e.printStackTrace();
				}
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		int j = 0;// 这两个值用于取到[Die]到[SubDie]的两个序号
		Map<String, String> Invalidation = new HashMap<String, String>();
		String s,dieno,diexy;
		String[] diexdiey;
		for (int m = 0,size=contentList.size(); m < size; m++) {
			s = contentList.get(m);
			if (s.contains("[Die]")) {
				j=m;
			}
			if (s.contains("[SubDie]")){
				break;
			}
			if(j>0){
				// 存有效die
				if (s.contains("ToBeProbed") || s.contains("ToInked")) {
					dieno = s.substring(s.indexOf("=") + 1, s.indexOf(","));
					diexdiey = s.split(",");
					diexy = diexdiey[1] + "," + diexdiey[2];
					xydieno.put(diexy, dieno);
				} else {
					dieno = s.substring(s.indexOf("=") + 1, s.indexOf(","));
					diexdiey = s.split(",");
					diexy = diexdiey[1] + "," + diexdiey[2];
					Invalidation.put(diexy, dieno);
				}
			}
			
		}
		if(v ==1){
			return xydieno;
		}
		if(v==2){
			return Invalidation;
		}
		return xydieno;
	}

	/**
	 * 把文件信息全部写入 String型的集合中
	 * 
	 * @param file
	 * @return
	 * @throws IOException
	 */
	public static List<String> getFile(String file) {
		List<String> filelist = new ArrayList<String>();
		FileInputStream fis = null;
		try {
			fis = new FileInputStream(file);
			BufferedReader br = new BufferedReader(new InputStreamReader(fis));
			String line = "";
			while ((line = br.readLine()) != null) {
				filelist.add(line);
			}
			if (fis != null) {
				fis.close();
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return filelist;
	}
	
	/**
	 * 从String 型集合中获取信息
	 * @param filelist
	 * @param productCatagory
	 * @param testOperator
	 * @return
	 */
		public Map<String, Object> getMessage(List<String> filelist,String productCatagory){
			String status=null;
			Map<String, Object> MessageresultMap=new HashMap<String, Object>();
			String TestStarTime="";
			String TestStopTime="";
			String Yield="";
			String Operator="";
			String DeviceID="";
			String LotID="";
			String WaferID="";
			String totalTestTime = "";
			int datanum=0;
			int TesterWaferSerialIDnum=0;
			int Limitnum=0;
			List<String> dieTypeList = new ArrayList<>();
			boolean flag=true;
			if(filelist.size()==0){
				status="上传失败，目标文件内容有误！";
				MessageresultMap.put("status", status);
				return MessageresultMap;
			}
			//获取关键信息
		    for(int i=0;i<filelist.size();i++){
		    	String s=filelist.get(i);
		    	if(s.contains("TestStarTime")){
		    		String TestStarTimeArrary[]=s.split(",");
		    		TestStarTime=getDefaultValue(TestStarTimeArrary, null, TestStarTime);
		    		continue;
		    	}else if(s.contains("TestStopTime")){
		    		String TestStopTimeArrary[]=s.split(",");
		    		TestStopTime=getDefaultValue(TestStopTimeArrary, null, TestStopTime);
		    		continue;
		    	}else if(s.contains("TotalTestTime")){
		    		String totalTest[] = s.split(",");
		    		totalTestTime = totalTest.length>2?totalTest[2]:totalTestTime;
		    		continue;
		    	}
		    	else if(s.contains("Operator")){
		    		String Operator1;
		    		String OperatorArray[]=s.split(",");
		    	    if(OperatorArray.length>=3 && !"".equals(OperatorArray[2])){
		    	    	Operator1=OperatorArray[2].trim();//操作人员
		    	    	if(Operator1.contains("\"")){
		    	    		Operator=Operator1.substring(1, Operator1.length()-1);
		    	    	}else{
		    	    		Operator=Operator1;
		    	    	}
		    	    	continue;
		    	    }else{
		    	    	status="上传失败，文件中的测试人员为空值！";
		    	    	MessageresultMap.put("status", status);
		    			return MessageresultMap;
		    	    }
		    	}else if(s.contains("Yield(%)")){
		    		String YieldArrary[]=s.split(",");
		    		Yield=getDefaultValue(YieldArrary,null,Yield)==null ? "0":getDefaultValue(YieldArrary,null,Yield);
		    		continue;
		    	}else if(s.contains("Limit")){
					Limitnum=i;
					continue;
		    	}else if(s.contains("DeviceID")){
		    		String DeviceIDArray[]=s.split(",");
		    	    if(DeviceIDArray.length>=3 && !"".equals(DeviceIDArray[2])){
		    	    	DeviceID=DeviceIDArray[2].trim();//获取产品编号
		    	    	TesterWaferSerialIDnum=i-1;
		    	    	continue;
		    	    }else{
		    	    	status="上传失败，文件中的设备编号为空值！";
		    	    	MessageresultMap.put("status", status);
		    			return MessageresultMap;
		    	    }
		    	}else if(s.contains("LotID")){
		    		String LotIDArray[]=s.split(",");
		    	    if(LotIDArray.length>=3 && !"".equals(LotIDArray[2])){
		    	    	LotID=LotIDArray[2].trim();//获取批次编号
		    	    	continue;
		    	    }else{
		    	    	status="上传失败，文件中的批次编号为空值！";
		    	    	MessageresultMap.put("status", status);
		    			return MessageresultMap;
		    	    }
		    	}else if(s.contains("WaferID")){
		    		flag=false;
		    		String WaferIDArray[]=s.split(",");
		    	    if(WaferIDArray.length>=3 && !"".equals(WaferIDArray[2])){
		    	    	WaferID=WaferIDArray[2].trim();//晶圆ID
		    	    	continue;
		    	    }else{
		    	    	status="上传失败，文件中的晶圆编号为空值！";
		    	    	MessageresultMap.put("status", status);
		    			return MessageresultMap;
		    	    }
		    	}else if(s.contains("Die X,Die Y,Bin,DieType,Die No,Subsite No,TestTime(ms)")){
					//判断是数据信息行
					datanum=i+1;
					break;
		    	}
		    }
		    
		    for(int i=Limitnum;i<TesterWaferSerialIDnum;i++){
		    	String[] att=filelist.get(i).split(",");
		    	if(att.length>6 && !"".equals(att[5].trim())){
		    		dieTypeList.add(att[5]);
		    	}
		    }
		    if(dieTypeList.size()==0){
		    	dieTypeList.add("DefaultType");
		    }
		    if(flag){
				status="上传失败，目标文件内容有误！";
				MessageresultMap.put("status", status);
				return MessageresultMap;
			}
		    if(productCatagory==null){
		    	productCatagory="测试仪";
		    }
		    //获取当前时间，就是用户编辑的时间,插入waferinfo表中
		    Date d = new Date();  
		    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
		    String dateNowStr = sdf.format(d);
		    //关键信息为空
		    MessageresultMap.put("status", status);
		    MessageresultMap.put("TestStarTime", TestStarTime);
		    MessageresultMap.put("TestStopTime", TestStopTime);
		    MessageresultMap.put("Yield", Yield);
		    MessageresultMap.put("Operator", Operator);
		    MessageresultMap.put("DeviceID", DeviceID);
		    MessageresultMap.put("LotID", LotID);
		    MessageresultMap.put("WaferID", WaferID);
		    MessageresultMap.put("dateNowStr", dateNowStr);
		    MessageresultMap.put("productCatagory", productCatagory);
		    MessageresultMap.put("datanum", datanum);
		    MessageresultMap.put("TesterWaferSerialIDnum", TesterWaferSerialIDnum);
		    MessageresultMap.put("Limitnum", Limitnum);
		    MessageresultMap.put("dieTypeList", dieTypeList);
		    MessageresultMap.put("totalTestTime", totalTestTime);
			return MessageresultMap;
		}
		
		/**
		 * 设置默认值
		 * @param array
		 * @param value
		 * @param value1
		 * @return
		 */
		public String getDefaultValue(String array[],String value, String value1){
			if(array.length>=3 && !"".equals(array[2])){
				value1=array[2].trim();//测试开始时间
		    	if(value1.contains("\"")){
		    		value=value1.substring(1, value1.length()-1);
		    	}else{
		    		value=value1;
		    	}
		    }else{
		    	value=null;
		    }
			return value;
		}
		
		/**
		 * dietype名称
		 * @param filelist
		 * @param TesterWaferSerialIDnum
		 * @param Limitnum
		 * @return
		 * @throws IOException
		 */
		public Map<Integer, Object> getDieTypeName(List<String> filelist,int TesterWaferSerialIDnum,int Limitnum) throws IOException{
			Map<Integer , Object> resultmap=new HashMap<Integer , Object>();
			String Min[] = null;
			for(int i=Limitnum,j=0;i<TesterWaferSerialIDnum-1;i=i+2,j++){
				Min=filelist.get(i).split(",");
				resultmap.put(j, Min[5]);
			}
			return resultmap;
		}
		/**
		 * 获取并存储map文件中8个参数
		 * @param file
		 * @return
		 * @throws IOException
		 * @throws Exception
		 */
		public static Map<String, Object> getMapFile(Connection conn,ParameterDao parameterDao,String file){
			Map<String, Object> MapFileResult=new HashMap<String, Object>();
			//存放所有文件
			List<String> filelist1=new ArrayList<String>(),filelist=new ArrayList<String>(),invalidationList = new ArrayList<String>();//存放8个参数
			FileInputStream fis = null;
			String status="success";//map文件标志信息
			String waferNO="";
			int flagnum=0;
			double diameter=-1,dieSizeX=-1,dieSizeY=-1,flatLength=-1;
			try {
				fis = new FileInputStream(file);
				BufferedReader br = new BufferedReader(new InputStreamReader(fis,"Unicode"));
				String line = "";
				
				while ((line = br.readLine()) != null){
					filelist1.add(line);
				}
				//map文件为ANSI编码方式
				if(filelist1.size()<5){
					br.close();
					fis.close();
					filelist1.clear();
					fis = new FileInputStream(file);
					BufferedReader br2 = new BufferedReader(new InputStreamReader(fis,"GBK"));
					line = "";
					flagnum=0;
					while ((line = br2.readLine()) != null){
						filelist1.add(line);
					}
					br2.close();
				}
				if(fis!=null){
					fis.close();
				}
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			invalidationList.clear();
			String s,dieno,diexy,str = "";
			String[] diexdiey;
			int indexFlag = 0;
			for(int i=0;i<filelist1.size();i++){
				s = filelist1.get(i);
				if(filelist1.get(i).contains("WaferID=")){
					waferNO=s.substring(s.indexOf("=")+1);
					
					continue;
				}
				if(s.contains("Diameter=")&&!s.contains("NotchDiameter=")){
					diameter=Double.parseDouble(s.substring(s.indexOf("=")+1));
					continue;
				}
				if(filelist1.get(i).contains("DieSizeX=")){
					dieSizeX=Float.parseFloat(s.substring(s.indexOf("=")+1));
					continue;
				}
				if(filelist1.get(i).contains("DieSizeY=")){
					dieSizeY=Float.parseFloat(s.substring(s.indexOf("=")+1));
					continue;
				}
				if(filelist1.get(i).contains("FlatLength=")){
					flatLength=Float.parseFloat(s.substring(s.indexOf("=")+1));
					continue;
				}
				
				if (s.contains("[Die]")) {
					indexFlag=i;
					continue;
				}
				if (s.contains("[SubDie]")){
					break;
				}
				if(indexFlag>0){
					// 存无效die
					if (s.contains("ToBeProbed") || s.contains("ToInked")) {
						
					} else{
						dieno = s.substring(s.indexOf("=") + 1, s.indexOf(","));
						diexdiey = s.split(",");
						diexy = diexdiey[1] + "," + diexdiey[2];
						str = diexy +","+dieno + ",0,-1,0" ;
						invalidationList.add(str);
					}
				}
			}
			//map文件格式有误
			if(filelist1.size()==0){
				status="上传失败，目标文件内容有误！";
				MapFileResult.put("status", status);
				return MapFileResult;
			//map文件中晶圆编号为空
			}else if("".equals(waferNO)){
				status="上传失败，文件中的晶圆编号为空值！";
				MapFileResult.put("status", status);
				return MapFileResult;
			//map文件中晶圆直径为空
			}else if(diameter==-1){
				status="上传失败，文件中的Diameter为空值！";
				MapFileResult.put("status", status);
				return MapFileResult;
			//格式无误
			}else if(dieSizeX==-1){
				status="上传失败，文件中的DieSizeX为空值！";
				MapFileResult.put("status", status);
				return MapFileResult;
			//格式无误
			}else if(dieSizeY==-1){
				status="上传失败，文件中的DieSizeY为空值！";
				MapFileResult.put("status", status);
				return MapFileResult;
			//格式无误
			}else if(flatLength==-1){
				status="上传失败，文件中的FlatLength为空值！";
				MapFileResult.put("status", status);
				return MapFileResult;
			//格式无误
			}else{
				
				for(int i=0;i<filelist1.size();i++){
					if(filelist1.get(i).contains("[IndexTranslation]") && !filelist1.get(i+1).contains("[Printing]")){
						flagnum=i;
						break;
					}
				}
				if(flagnum>0){
					for(int j=flagnum+2;j<flagnum+10;j++){
						//8个参数存在空值
						if(j>=filelist1.size()||"".equals(filelist1.get(j))||filelist1.get(j).contains("[Printing]")){
							if(j==flagnum+2){
								status="上传失败，文件中缺失编号坐标X轴增长方向！";
							}else if(j==flagnum+3){
								status="上传失败，文件中缺失编号坐标Y轴增长方向！";
							}else if(j==flagnum+4){
								status="上传失败，文件中缺失晶圆图坐标X轴增长方向！";
							}else if(j==flagnum+5){
								status="上传失败，文件中缺失晶圆图坐标Y轴增长方向！";
							}else if(j==flagnum+6){
								status="上传失败，文件中缺失晶圆图参考Die的X坐标！";
							}else if(j==flagnum+7){
								status="上传失败，文件中缺失晶圆图参考Die的Y坐标！";
							}else if(j==flagnum+8){
								status="上传失败，文件中缺失晶圆图参考Die编号的X坐标！";
							}else{
								status="上传失败，文件中缺失晶圆图参考Die编号的Y坐标！";
							}
							MapFileResult.put("status", status);
							return MapFileResult;
						//8个参数不存在空值
						}else{
							filelist.add(filelist1.get(j));
						}
				}
				
				}
				if("success".equals(status)){
					MapParameterDO mapDO = new MapParameterDO();
					mapDO.setDiameter(diameter);
					mapDO.setDieXMax(dieSizeX);
					mapDO.setDieYMax(dieSizeY);
					mapDO.setCuttingEdgeLength(flatLength);
					mapDO.setWaferNumber(waferNO);
					mapDO.setDirectionX(filelist.size()>0?filelist.get(0):"Right");
					mapDO.setDirectionY(filelist.size()>0?filelist.get(1):"Top");
					mapDO.setSetCoorX(filelist.size()>0?filelist.get(2):"Right");
					mapDO.setSetCoorY(filelist.size()>0?filelist.get(3):"Down");
					mapDO.setSetCoorDieX(filelist.size()>0?Integer.parseInt(filelist.get(4)):0);
					mapDO.setSetCoorDieY(filelist.size()>0?Integer.parseInt(filelist.get(5)):1);
					mapDO.setStandCoorDieX(filelist.size()>0?filelist.get(6):"AAAA");
					mapDO.setStandCoorDieY(filelist.size()>0?filelist.get(7):"AAAA");
					if(parameterDao.getMapParameter(conn, waferNO)){
						status = parameterDao.updateMapParameter(conn, mapDO);
					}else{
						status = parameterDao.insertMapParameter(conn,mapDO);
					}
				}
				MapFileResult.put("status", status);
				MapFileResult.put("waferNO", waferNO);
				mapfilelist.put(waferNO, invalidationList);
				return MapFileResult;
			}
		}
		/**
		 * 获取上下限
		 * @param filelist
		 * @param dietype
		 * @param TesterWaferSerialIDnum
		 * @param Limitnum
		 * @return
		 * @throws IOException
		 */
		public Map<String, Object> getUpandDown(List<String> filelist,String dietype,int TesterWaferSerialIDnum,int Limitnum) throws IOException{
			Map<String , Object> resultmap=new HashMap<String , Object>();
			String Max[] = null;
			String Min[] = null;
			int num=Integer.parseInt(dietype);//循环次数
			//dietype越界
			if(Limitnum+2+num*2>TesterWaferSerialIDnum){
				Min=filelist.get(Limitnum).split(",");
				Max=filelist.get(Limitnum+1).split(",");
			}else{
				Min=filelist.get(Limitnum+num*2).split(",");
				Max=filelist.get(Limitnum+1+num*2).split(",");
			}
			resultmap.put("Max", Max);
		    resultmap.put("Min", Min);
			return resultmap;
		}
		/**
		 * 获取所有器件类型对应的参数信息
		 * @param filelist CSV数据
		 * @param datanum 参数数据行
		 * @param testerWaferSerialIDnum 
		 * @param limitnum  上下限起始行
		 * @param dieType  器件类型的集合
		 * @return
		 * @throws IOException
		 */
		public Map<String, List<Object[]>> getParameter(List<String> filelist,int datanum,int testerWaferSerialIDnum,int limitnum,List<String> dieType) throws IOException{
			String[] dealparam=null;//定义信息数组
			int typeCount = dieType.size();
		    Map<String, List<Object[]>> parametermap=new HashMap<String , List<Object[]>>();
			dealparam = datanum>0? filelist.get(datanum-1).split(","):null;
			int length= datanum>0? dealparam.length-6:0;//参数个数长度+1
			String parameterNameUnit="";
			String Max[] = null;
			String Min[] = null;
			List<Object[]> list = null;
			for(int num=1;num<=typeCount;num++){
				list = new ArrayList<>();
				if(limitnum+2+num*2>testerWaferSerialIDnum){
					Min=filelist.get(limitnum).split(",");
					Max=filelist.get(limitnum+1).split(",");
				}else{
					Min=filelist.get(limitnum+num*2).split(",");
					Max=filelist.get(limitnum+1+num*2).split(",");
				}
				System.out.println(Arrays.toString(Min));
				System.out.println(Arrays.toString(Max));
				String column = "";
				Object[] obj = null;
				String min="";
				String max="";
				for(int dp=1;dp<length;dp++){
					column = "C"+dp;
					parameterNameUnit=dealparam[6+dp];//参数名字加单位
					String parameterUnit=" ";
					String parameterName=" ";
					if(parameterNameUnit.lastIndexOf("(")!=-1 && parameterNameUnit.lastIndexOf(")")!=-1){
						parameterName=parameterNameUnit.substring(0, parameterNameUnit.lastIndexOf("("));//切割上面的字符串得到参数名称R1,R2,R3,R4
						parameterUnit=parameterNameUnit.substring(parameterNameUnit.lastIndexOf("(")+1, parameterNameUnit.lastIndexOf(")"));//得到参数单位ms
					}else{
						parameterName=parameterNameUnit;
					}
					//设默认值
					if("".equals(Min[6+dp])){
						min = "-9E37";
					}else{
						min=Min[6+dp];	
					}
					if("".equals(Max[6+dp])){
						max = "9E37";
					}else{
						max=Max[6+dp];
					}
					obj = new Object[]{parameterName,parameterUnit,column,max,min};
					list.add(obj);
					
					}
				parametermap.put(dieType.get(num-1), list);
			}
			
			
			return parametermap;
		}
		
		/**
		 * 判断路径下是否包含图片文件
		 * @param path
		 * @return
		 */
		public static boolean isExistImage(String path){
			File root = new File(path);
			if(root.isDirectory()){
				File[] files = root.listFiles();
				try {
					for(File file:files){
						if(file.isDirectory() ){
							if(!fileType){
								isExistImage(file.getAbsolutePath());
							}
						}else{
							BufferedImage image = ImageIO.read(file);
							if(image != null){
								fileType = true;
								break;
							}
						}
						
					}
				} catch (IOException e) {
					e.printStackTrace();
					System.out.println("ImageReader解析过程出错！");
				}
			}
			System.out.println("fileType:"+fileType);
			return fileType;
		}
		
		
		
		
		
}
