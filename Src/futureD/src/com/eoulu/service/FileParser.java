/**
 * 
 */
package com.eoulu.service;

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
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.eoulu.dao.ParameterDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.entity.MapParameterDO;
import com.eoulu.exception.ExceptionLog;
import com.eoulu.transfer.FileFilterTool;
import com.eoulu.util.DataBaseUtil;
import com.eoulu.util.FileUtil;



/**
 * @author mengdi
 *
 * 
 */
public class FileParser {
	private static List<String> suffix = null; 
	static{
		suffix = new ArrayList<>();
		suffix.add(".csv");
		suffix.add(".CSV");
		suffix.add(".pms");
		suffix.add(".PMS");
		suffix.add(".S2P");
		suffix.add(".s2p");
		suffix.add(".xlsx");
	}
	public ArrayList<String> filelist = new ArrayList<String>();
	// zip压缩文件中 上传失败的CSV文件,map文件 和 excel文件
	public ArrayList<String> faileCSV = new ArrayList<String>();
	// 存放map的晶圆编号和路径
	public Map<String, Object> mapfilelist = new HashMap<String, Object>();
	// 存放map的晶圆编号和路径
	public Map<String, Object> excelfilelist = new HashMap<String, Object>();
	// CSV总个数
	public int CSVnum = 0;
	// Map总个数
	public int Mapnum = 0;
	// Excel总个数
	public int Excelnum = 0;

	public Map<String, Object> Zip(String tempPath, String fileName, String temp, String filename2, Boolean flag,
			String productCatagory, String testOperator, String description, String currentUser, String dataFormat) {
		StringBuffer errorFile = new StringBuffer("");// 错误格式文件
		String filename = "";// 上传失败的CSV、Map、Excel文件名
		String status = "";
		int filternum = 1;// 标志先导入map文件和CSV文件
		Map<String, Object> resultMap = new HashMap<String, Object>();
		// 用户上传的是一个压缩包
		// 若是一个文件夹。
		File file1 = FileUtil.unZipFiles(tempPath + "\\" + fileName, temp + "\\" + filename2);
		System.out.println(file1.getName());
		if (!"0".equals(dataFormat)) {
			resultMap.put("flag", false);
			resultMap.put("status", "上传的文件与选择的格式不一致！");
			return resultMap;
		}
		System.out.println("EOULU");
		// 导入map
		getFiles(file1.getAbsolutePath(), flag, productCatagory, testOperator, description, tempPath, temp, filternum,
				currentUser, dataFormat, fileName);
		// 导入excel文件
		filternum = 2;
		getFiles(file1.getAbsolutePath(), flag, productCatagory, testOperator, description, tempPath, temp, filternum,
				currentUser, dataFormat, fileName);
		// 导入CSV文件
		filternum = 3;
		getFiles(file1.getAbsolutePath(), flag, productCatagory, testOperator, description, tempPath, temp, filternum,
				currentUser, dataFormat, fileName);
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

		flag = CSVnum > 0 || Mapnum > 0 || Excelnum > 0 ? false : true;
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
			status = "";
		}
		resultMap.put("flag", flag);// 存在CSV
		resultMap.put("status", status);// 上传失败的CSV文件名
		return resultMap;
	}

	void getFiles(String filePath, Boolean flag, String productCatagory, String testOperator, String description,
			String tempPath, String temp, int filternum, String currentUser, String dataFormat, String fileName) {
		File root = new File(filePath);
		File[] files = root.listFiles();// 获取当前目录下的所有文件与文件夹
		boolean flagDirectory = isExist(files);
		CSV(filePath, flag, productCatagory, testOperator, description, tempPath, temp, filternum, currentUser,
				flagDirectory, dataFormat, fileName);
		for (File file : files) {
			if (file.isDirectory()) {
				if (!flagDirectory) {// 没有曲线数据时，才进入向下一级文件夹目录；当前路径下若有文件夹且包含.csv与.map文件，则在读取.csv文件后取读取曲线数据
					getFiles(file.getAbsolutePath(), flag, productCatagory, testOperator, description, tempPath, temp,
							filternum, currentUser, dataFormat, fileName);
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

	public void CSV(String path, Boolean flag, String productCatagory, String testOperator, String description,
			String tempPath, String temp, int filternum, String currentUser, boolean flagDirectory, String dataFormat,
			String fileName) {
		/*
		WaferDao fileDao = new WaferDao();
		File file1 = new File(path);
		FileFilterTool filetool = new FileFilterTool();
		String failcsv;// 上传失败的CSV文件
		String status = "";// 上传文件的返回值
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
		for (int i = 0, length = files1.length; i < length; i++) {
			try {
				// zip,调用Zip方法
				if (files1[i].getName().endsWith(".CSV") || files1[i].getName().endsWith(".csv")) {
					flag = false;
					CSVnum = CSVnum + 1;
					String waferid = getWaferID(files1[i].getAbsolutePath());
					Connection conn2 = new DataBaseUtil().getConnection();
					boolean flag2 = fileDao.queryWaferinfo(conn2, waferid);
					// CSV文件中晶圆编号为空 或者文件内容有误
					if ("上传失败，文件中的晶圆编号为空值！".equals(waferid) || "上传失败，目标文件内容有误！".equals(waferid)) {
						failcsv = getReturn(files1[i].getName(), waferid);
						faileCSV.add(failcsv);
						conn2.close();
						continue;
					}
					if (flag2) {
						status = "文件已经上传！";
						failcsv = getReturn(files1[i].getName(), status);
						faileCSV.add(failcsv);
						conn2.close();
						continue;
					}
					// 找到对应的map文件
					if (mapfilelist.get(waferid) != null) {
						// 把map文件内容写入CSV文件
						WriteToCsv(files1[i].getAbsolutePath(), (String) mapfilelist.get(waferid));
						long timeCSV = System.currentTimeMillis();
						status = fileDao.GetWaferData(conn2, files1[i].getAbsolutePath(), productCatagory, testOperator,
								description, files1[i].getAbsolutePath(), dataFormat, fileName);
						// 未找到对应的map文件
						long timeCSV2 = System.currentTimeMillis();
						System.out.println("how long:" + (timeCSV2 - timeCSV));
					} else {
						conn2.close();
						status = "上传失败，导入目标文件前没有导入对应的map文件！";
					}
					failcsv = getReturn(files1[i].getName(), status);
					if (!"".equals(failcsv)) {
						faileCSV.add(failcsv);
					}
				} else if (files1[i].getName().endsWith(".map")) {
					flag = false;
					Mapnum = Mapnum + 1;
					MapFileDao mapFileDao = new MapFileDao();
					Map<String, Object> resultMap = mapFileDao.SaveMapFile(files1[i].getAbsolutePath());
					status = (String) resultMap.get("status");
					if ("文件已经上传！".equals(status) || "success".equals(status)) {
						Set<String> keys = resultMap.keySet();
						for (String Waferid : keys) {
							mapfilelist.put(Waferid, resultMap.get(Waferid));
							break;
						}
					}
					failcsv = getReturn(files1[i].getName(), status);
					// 上传失败
					if (!"".equals(failcsv)) {
						faileCSV.add(failcsv);
					}
				} else if (files1[i].getName().endsWith(".xlsx") || files1[i].getName().endsWith(".xls")) {
					flag = false;
					Excelnum = Excelnum + 1;
					String waferid = Transtion.GetexcelWaferID(files1[i].getAbsolutePath());
					Connection conn2 = new DataBaseUtil().getConnection();
					boolean flag2 = fileDao.queryWaferinfo(conn2, waferid);
					// excel文件中晶圆编号为空
					if ("上传失败，文件中的晶圆编号为空值！".equals(waferid)) {
						failcsv = getReturn(files1[i].getName(), waferid);
						faileCSV.add(failcsv);
						conn2.close();
						continue;
					}
					if (flag2) {
						status = "文件已经上传！";
						failcsv = getReturn(files1[i].getName(), status);
						faileCSV.add(failcsv);
						conn2.close();
						continue;
					}
					// 找到对应的map文件
					if (mapfilelist.get(waferid) != null) {
						String CSVname = Transtion.readfile(files1[i].getAbsolutePath(),
								(String) mapfilelist.get(waferid));
						if (!(CSVname.contains("WaferID"))) {
							status = CSVname;
							conn2.close();
							// 导入转换后的CSV文件。
						} else {
							String CSV[] = CSVname.split("\n");
							List<String> filelist = new ArrayList<>();
							for (int j = 0; j < CSV.length; j++) {
								filelist.add(CSV[j]);
							}
							status = fileDao.GetWaferDataExcel(conn2, filelist, productCatagory, testOperator,
									description, files1[i].getAbsolutePath(), currentUser, dataFormat);
						}
						// 未找到对应的map文件
					} else {
						status = Transtion.getExcelData(files1[i].getAbsolutePath(), productCatagory, testOperator,
								description, currentUser, dataFormat, "", 0);
					}
					failcsv = getReturn(files1[i].getName(), status);
					if (!"".equals(failcsv)) {
						faileCSV.add(failcsv);
					}
				}
			} catch (IOException e) {
				ExceptionLog.printException(e);
				failcsv = getReturn(files1[i].getName(), "文件不存在！");
				faileCSV.add(failcsv);
				continue;
			} catch (SQLException e) {
				ExceptionLog.printException(e);
				failcsv = getReturn(files1[i].getName(), "数据库操作异常！");
				faileCSV.add(failcsv);
				continue;
			} catch (Exception e) {
				ExceptionLog.printException(e);
				failcsv = getReturn(files1[i].getName(), "未知错误！");
				faileCSV.add(failcsv);
				continue;
			}
		}*/
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
			name = "";
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

	public String getWaferID(String file) throws IOException {
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
		List<String> Content = new ArrayList<String>();// 该list是将文件中的内容全部取出
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
						Content.add(s + "\n");
					}
					if (Content.size() < 10) {
						Content.removeAll(Content);
						fis = new FileInputStream(file);
						bs = new BufferedReader(new InputStreamReader(fis, "GBK"), 5 * 1024 * 1024);
						while ((s = bs.readLine()) != null) {
							Content.add(s + "\n");
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
		int j = 0, k = 0;// 这两个值用于取到[Die]到[SubDie]的两个序号
		String Info;
		for (int i = 0; i < Content.size(); i++) {
			Info = Content.get(i);
			if (Info.contains("[Die]")) {
				j = i;
			} else if (Info.contains("[SubDie]")) {
				k = i;
			}
		}
		// 将所有重要信息即die的信息存到这个list中。
		List<String> ImportantInfo = new ArrayList<String>();
		for (int s = j + 1; s < k; s++) {
			ImportantInfo.add(Content.get(s));
		}
		Map<String, String> Invalidation = new HashMap<String, String>();
		String s;
		String dieno;
		String diexy;
		String[] diexdiey;
		for (int m = 0; m < ImportantInfo.size(); m++) {
			s = ImportantInfo.get(m);
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
		switch (v) {
		case 1:
			return xydieno;

		case 2:
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
		public Map<String, Object> getMessage(List<String> filelist,String productCatagory,String testOperator){
			String status=null;
			Map<String, Object> MessageresultMap=new HashMap<String, Object>();
			String TestStarTime="";
			String TestStopTime="";
			String Yield="";
			String Operator="";
			String DeviceID="";
			String LotID="";
			String WaferID="";
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
		    	}else if(s.contains("Operator")){
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
		    //获取非关键信息
			//当没有传入的这个参数是空的时候，就给个默认值为operator[2],(即前台没填这个)如果传了，就是本身。
		    if(testOperator==null){
		    	testOperator=Operator;
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
		    MessageresultMap.put("testOperator", testOperator);
		    MessageresultMap.put("productCatagory", productCatagory);
		    MessageresultMap.put("datanum", datanum);
		    MessageresultMap.put("TesterWaferSerialIDnum", TesterWaferSerialIDnum);
		    MessageresultMap.put("Limitnum", Limitnum);
		    MessageresultMap.put("dieTypeList", dieTypeList);
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
		 * 获取map文件中8个参数和晶圆编号、晶圆直径
		 * @param file
		 * @return
		 * @throws IOException
		 * @throws Exception
		 */
		public Map<String, Object> getMapFile(String file) throws IOException,Exception{
			Map<String, Object> MapFileResult=new HashMap<String, Object>();
			List<String> filelist1=new ArrayList<String>();//存放所有文件
			List<String> filelist=new ArrayList<String>();//存放8个参数
			FileInputStream fis = null;
			String status=null;//map文件标志信息
			String Waferid="";
			float Diameter=-1;
			float DieSizeX=-1;
			float DieSizeY=-1;
			float FlatLength=-1;
			fis = new FileInputStream(file);
			BufferedReader br = new BufferedReader(new InputStreamReader(fis,"Unicode"));
			String line = "";
			int flagnum=0;
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
			for(int i=0;i<filelist1.size();i++){
				if(filelist1.get(i).contains("WaferID=")){
					Waferid=filelist1.get(i).substring(filelist1.get(i).indexOf("=")+1);
					continue;
				}
				if(filelist1.get(i).contains("Diameter=")&&!filelist1.get(i).contains("NotchDiameter=")){
					Diameter=Float.parseFloat(filelist1.get(i).substring(filelist1.get(i).indexOf("=")+1));
					continue;
				}
				if(filelist1.get(i).contains("DieSizeX=")){
					DieSizeX=Float.parseFloat(filelist1.get(i).substring(filelist1.get(i).indexOf("=")+1));
					continue;
				}
				if(filelist1.get(i).contains("DieSizeY=")){
					DieSizeY=Float.parseFloat(filelist1.get(i).substring(filelist1.get(i).indexOf("=")+1));
					continue;
				}
				if(filelist1.get(i).contains("FlatLength=")){
					FlatLength=Float.parseFloat(filelist1.get(i).substring(filelist1.get(i).indexOf("=")+1));
					break;
				}
			}
			//map文件格式有误
			if(filelist1.size()==0){
				status="上传失败，目标文件内容有误！";
				MapFileResult.put("status", status);
				return MapFileResult;
			//map文件中晶圆编号为空
			}else if("".equals(Waferid)){
				status="上传失败，文件中的晶圆编号为空值！";
				MapFileResult.put("status", status);
				return MapFileResult;
			//map文件中晶圆直径为空
			}else if(Diameter==-1){
				status="上传失败，文件中的Diameter为空值！";
				MapFileResult.put("status", status);
				return MapFileResult;
			//格式无误
			}else if(DieSizeX==-1){
				status="上传失败，文件中的DieSizeX为空值！";
				MapFileResult.put("status", status);
				return MapFileResult;
			//格式无误
			}else if(DieSizeY==-1){
				status="上传失败，文件中的DieSizeY为空值！";
				MapFileResult.put("status", status);
				return MapFileResult;
			//格式无误
			}else if(FlatLength==-1){
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
				MapFileResult.put("status", status);
				MapFileResult.put("Waferid", Waferid);
				MapFileResult.put("Diameter", Diameter);
				MapFileResult.put("DieSizeX", DieSizeX);
				MapFileResult.put("DieSizeY", DieSizeY);
				MapFileResult.put("FlatLength", FlatLength);
				MapFileResult.put("filelist", filelist);
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
				
				String column = "C";
				Object[] obj = null;
				String min="";
				String max="";
				for(int dp=1;dp<length;dp++){
					column = column+dp;
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
					if("".equals(Min[dp-1])){
						min = "-9E37";
					}else{
						min=Min[dp-1];	
					}
					if("".equals(Max[dp-1])){
						max = "9E37";
					}else{
						max=Max[dp-1];
					}
					obj = new Object[]{parameterName,parameterUnit,column,max,min};
					list.add(obj);
					
					}
				parametermap.put(dieType.get(num-1), list);
			}
			
			
			return parametermap;
		}
		/**
		 * map文件数据存储
		 * @param file
		 * @return
		 */
		public Map<String, Object> SaveMapFile(String file){
			String status=null;
			String waferid="";//晶圆编号
			Double diameter;
			Double dieSizeX;
			Double dieSizeY;
			Double flatLength;
			List<String> filelist=new ArrayList<String>();//存放8个参数
			Map<String, Object> resultMap=new HashMap<String, Object>();
			Connection conn=null;
			try {
				Map<String, Object> mapFileResult=getMapFile(file);
				status=(String) mapFileResult.get("status");
				if(status!=null){
					resultMap.put("status", status);
					return resultMap;
				}else{
					waferid=(String) mapFileResult.get("Waferid");
					diameter=(Double) mapFileResult.get("Diameter");
					dieSizeX=(Double) mapFileResult.get("DieSizeX");
					dieSizeY=(Double) mapFileResult.get("DieSizeY");
					flatLength=(Double) mapFileResult.get("FlatLength");
					filelist= (List<String>) mapFileResult.get("filelist");
					MapParameterDO mapDO = new MapParameterDO();
					mapDO.setDiameter(diameter);
					mapDO.setDieXMax(dieSizeX);
					mapDO.setDieYMax(dieSizeY);
					mapDO.setCuttingEdgeLength(flatLength);
					mapDO.setDirectionX(filelist.get(0));
					mapDO.setDirectionY(filelist.get(1));
					mapDO.setSetCoorX(filelist.get(2));
					mapDO.setSetCoorY(filelist.get(3));
					mapDO.setSetCoorDieX(Integer.parseInt(filelist.get(4)));
					mapDO.setSetCoorDieY(Integer.parseInt(filelist.get(5)));
					mapDO.setStandCoorDieX(filelist.get(6));
					mapDO.setStandCoorDieY(filelist.get(7));
					mapDO.setWaferId(0);
					status = new ParameterDao().insertMapParameter(conn, mapDO);
					resultMap.put(waferid, file);
					resultMap.put("status", status);
				}//加锁
			}catch (IOException e) {
				e.printStackTrace();
			} catch(SQLException e){
				
			}catch (Exception e) {
				e.printStackTrace();
			}finally {
				if(conn!=null){
					try {
						conn.close();
					} catch (SQLException e) {
						e.printStackTrace();
					}
				}
			}
			return resultMap;
		}
		
		
		/**
		 * 此处用于曲线数据添加，需改
		 * @param conn
		 * @param file
		 * @param WaferID
		 * @return
		 */
		/*
		public String insertCurve(Connection conn, String file, String WaferID) {
			System.out.println("读到了么：" + file);
			long time0 = System.currentTimeMillis();
			int WaferSerialID = getWaferSerialID(conn, WaferID);
			file = file.substring(0, file.lastIndexOf("."));
			File file1 = new File(file);
			String status = null;
			File[] files = file1.listFiles();
			CurveParameter curveParameter = new CurveParameter();
			int paramId = 0;
			if (files != null) {
				for (File temp : files) {
					String curveType = temp.getName();
					File[] curvefile = temp.listFiles();
					for (File curve : curvefile) {
						String name = curve.getName();
						String su = name.substring(name.indexOf("."));
						if(!suffix.contains(su)){
							break;
						}
						String[] fileName = null;
						if (!name.contains("_")) {
							fileName = name.substring(0, curve.getName().indexOf(".")).split("-");
						} else {
							fileName = name.substring(0, curve.getName().indexOf(".")).split("_");
						}
						if (fileName.length < 3) {
							status = "曲线数据文件名格式有误！";
							break;
						}
						String dieType = fileName[0];
						String subdieNO = "";
						String group = "";
						subdieNO = fileName[1];
						group = fileName[2];
						try {
							List<String> list = getFile(curve.getAbsolutePath());
							if (".S2P".equalsIgnoreCase(su)) {
								curveParameter.setWaferSerialID(WaferSerialID);
								curveParameter.setCurveType(curveType);
								curveParameter.setSubdieNO(subdieNO);
								curveParameter.setDieType(dieType);
								curveParameter.setDeviceGroup(group);
								paramId = new CurveDao().insertCurveParameter(conn, curveParameter);
								List<CurveSmithData> curveList = new ArrayList<>();
								int index = 0;
								for(int i=0;i<list.size();i++){
									String tempStr = list.get(i).trim();
									if(i>0 && list.get(i-1).startsWith("#")){
										index = i;
									}
									if(index>0 && i>index && !tempStr.equals("")){
										String[] datas = tempStr.replaceAll("\t", " ").split(" ");
										CurveSmithData curvedata = new CurveSmithData();
										curvedata.setCurve_parameter_id(paramId);
										curvedata.setWafer_serial_id(WaferSerialID);
										curvedata.setFequency(Double.parseDouble(datas[0]));
										curvedata.setReal_part_s11(Double.parseDouble(datas[1]));
										curvedata.setImaginary_part_s11(Double.parseDouble(datas[2]));
										curvedata.setReal_part_s12(Double.parseDouble(datas[3]));
										curvedata.setImaginary_part_s12(Double.parseDouble(datas[4]));
										curvedata.setReal_part_s21(Double.parseDouble(datas[5]));
										curvedata.setImaginary_part_s21(Double.parseDouble(datas[6]));
										curvedata.setReal_part_s22(Double.parseDouble(datas[7]));
										curvedata.setImaginary_part_s22(Double.parseDouble(datas[8]));
										curveList.add(curvedata);
									}
								}
								status = new CurveDao().insertSmithData(conn, curveList);
								if(status!=null){
									break;
								}
							} else {
								String[] datas = null;
								if (list.size() > 1) {
									datas = list.get(0).split(",");
									if (!saveCurveDatas(conn, datas, "Parameter", WaferSerialID, curveType, dieType, subdieNO,
											group).equals("")) {
										status = "曲线参数表添加数据失败！";
										break;
									}
								}
								//可优化
								for (int i = 1; i < list.size() - 1; i++) {
									datas = list.get(i).replaceAll("\\s*", "").split(",");
									if (!saveCurveDatas(conn, datas, "datas", WaferSerialID, curveType, dieType, subdieNO,
											group).equals("")) {
										status = "曲线数据表添加数据失败！";
										break;
									}

								}
							}
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
				}
			}
			long time2 = System.currentTimeMillis();
	System.out.println("曲线数据："+(time2-time0));
			return status;
		}*/
		
}
