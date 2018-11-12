/**
 * 
 */
package com.eoulu.parser;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.eoulu.dao.ParameterDao;
import com.eoulu.entity.WaferDO;
import com.eoulu.service.WaferService;
import com.eoulu.service.impl.WaferServiceImpl;
import com.eoulu.transfer.AlpToNumber;
import com.eoulu.util.DataBaseUtil;


/**
 * @author mengdi
 *
 * 
 */
public class ExcelParser {

	private static String Mediantf(String str) {
		// 求中值
		if (SymbolSmallBig(str)) {
			return "0";
		} else if (CheckSymbol(str)) {
			return "0";
		} else {
			String[] dub = str.split("\\±");
			return dub[0];
		}
	}

	private static String PlusMinusf(String str) {
		// 求正负百分比
		if (SymbolSmallBig(str)) {
			return "0";
		} else if (CheckSymbol(str)) {
			return "0";
		} else {
			String[] dub = str.split("\\±");
			String[] str1 = dub[1].split("\\%");
			return str1[0];
		}
	}

	private static String MaxDefaultType(double Mediant, double PlusMinus) {

		DecimalFormat df = new DecimalFormat("#.0000");
		// 保留一位小数
		double MediantNum = (Mediant + (Mediant * PlusMinus / 100));

		String MediantNumdf = null;
		MediantNumdf = String.format("%.4g", MediantNum);
		return MediantNumdf.toString();
	}

	private static String MinDefaultType(double Mediant, double PlusMinus) {
		DecimalFormat df = new DecimalFormat("#.0000");
		// 保留一位小数
		double MediantNum = (Mediant - Mediant * (PlusMinus / 100));
		String MediantNumdf = null;
		MediantNumdf = df.format(MediantNum);
		return MediantNumdf.toString();
	}

	private static boolean CheckSymbol(String Str) {
		char[] chars = new char[1];
		chars[0] = Str.charAt(0);
		if (chars[0] == '±') {
			return true;
		} else {
			return false;
		}
	}

	private static String SymbolNum(String Str) {
		String[] num = Str.split("\\±");
		return num[1];
	}

	private static boolean SymbolSmallBig(String Str) {
		char[] chars = new char[2];
		chars[0] = Str.charAt(0);
		chars[1] = Str.charAt(1);
		if ((chars[0] == '>') & (chars[1] == '=')) {
			return true;
		} else {
			return false;
		}
	}

	private static String SymbolSmallBigNum(String Str) {
		String[] num = Str.split(">=");
		return num[1];
	}

	public static String getExcelData(Connection conn,String filepath, String productCategory, String details,
			String currentUser, String dataFormat) {
		boolean limit = false;
		boolean databool = false;
		int datanum = 1;
		Date date = new Date();
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time = format.format(date),status="";
		FileInputStream excelFileInputStream;
		XSSFSheet sheet = null;;
		try {
			excelFileInputStream = new FileInputStream(filepath);
			XSSFWorkbook workbook = new XSSFWorkbook(excelFileInputStream);
			excelFileInputStream.close();
			sheet = workbook.getSheetAt(0);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	
		int paramNum = 0;
		// 变量定义
		String Tester = "", TestStarTime = "",TestStopTime = "",WaferID = "",LotID = "",DeviceID = "",FileName = "",ComputerName = "", TotalTestTime = "";
		boolean coordinateFlag = false,flag = false;
		/* 存放参数以及上下限,key:dieType;[]:参数名、参数单位、参数字段、上限、下限 */
		Map<String, List<String>> limitMap = new HashMap<String, List<String>>();
		
		List<List<String>> params = new ArrayList<>();
		List<String> paramLs = null;
		String columnStr = "",condition = "";
		
		Map<String,List<Object[]>> dieMap = new HashMap<>();//key:dieType;value:器件类型对应的die信息
		List<Object[]> dieList = new ArrayList<>();
		Object[] att = null; //字母坐标，X坐标，Y坐标，die编号，bin，testtime,结果参数
		
		// 传参之用
		Map<String, Object> map = new HashMap<>();
		System.out.println("总行数：" + sheet.getLastRowNum());
		
		int maxX = 0, minX = 10000000, maxY = 0, minY = 10000000,x=0,y=0,dieNO=0;
		String alphabetic = "";
		for (int i = 0; i <= sheet.getLastRowNum(); i++) {
			XSSFRow row = sheet.getRow(i);
			if (row == null || row.getCell(0) == null || "".equals(row.getCell(0).toString())) {
				continue;

			}
			if (row != null && "Type".equals(row.getCell(0).toString())) {
				if("DieX".equals(row.getCell(2).toString())){
					coordinateFlag = true;
				}
				flag = true;
				continue;
			}
			if(!"Type Yield".equals(row.getCell(0).toString()) && flag){
				alphabetic = row.getCell(1).toString();
				x = Cal(alphabetic.split("/")[1]);
				y = Cal(alphabetic.split("/")[0]);
				maxX = maxX>x?maxX:x;
				minX = minX<x?minX:x;
				maxY = maxY>y?minY:y;
				minY = minY<y?minY:y;
			}
		}
		Map<String,Integer> dieLimit = new HashMap<>();
		dieLimit.put("maxX", maxX);
		dieLimit.put("minX", minX);
		dieLimit.put("maxY", maxY);
		dieLimit.put("minY", minY);
		  double sizeX = 200000/(maxX-minX+1),sizeY = 200000/(maxY-minY+1);
		System.out.println("dieLimit:"+dieLimit);
		String str1 = "-?[0-9]+.?[0-9]+", str2 = "-?[0-9]+.[0-9]+E[0-9]+";
		Pattern pattern = Pattern.compile(str1), pattern2 = Pattern.compile(str2);
		for (int i = 0; i <= sheet.getLastRowNum(); i++) {
			XSSFRow row = sheet.getRow(i);
			if (row == null) {
				limit = false;
				continue;

			}
			if ((row.getCell(0) == null || "".equals(row.getCell(0).toString()))
					&& (row.getCell(1) == null || "".equals(row.getCell(1).toString()))) {
				limit = false;
				continue;
			}
			if ("FileName".equals(row.getCell(0).toString())) {
				if (row.getCell(2) != null) {
					FileName = row.getCell(2).toString();
				}
			}
			if ("ComputerName".equals(row.getCell(0).toString())) {
				if (row.getCell(2) != null) {
					ComputerName = row.getCell(2).toString();
				}
			}
			if ("TotalTestTime".equals(row.getCell(0).toString())) {
				if (row.getCell(2) != null) {
					TotalTestTime = row.getCell(2).toString();
				}
			}
			if ("Tester".equals(row.getCell(0).toString())) {
				if (row.getCell(2) == null || "".equals(row.getCell(2).toString().trim())) {
					Tester = currentUser;
				} else {
					Tester = row.getCell(2).toString();
				}
				continue;
			}
			if ("TestStarTime".equals(row.getCell(0).toString())) {
				if (row.getCell(2) == null || "".equals(row.getCell(2).toString().trim())) {
					TestStarTime = time;
				} else {

					TestStarTime = row.getCell(2).toString().split("\"")[1];

				}
				continue;
			}
			if ("TestStopTime".equals(row.getCell(0).toString())) {
				if (row.getCell(2) == null || "".equals(row.getCell(2).toString().trim())) {
					TestStopTime = time;
				} else {
					TestStopTime = row.getCell(2).toString().split("\"")[1];
				}
				continue;
			}
			if ("WaferID".equals(row.getCell(0).toString())) {
				if (row.getCell(2) == null || "".equals(row.getCell(2).toString().trim())) {
					return "上传失败，文件中的晶圆编号为空值！";
				}
				WaferID = row.getCell(2).toString().trim();
				continue;
			}
			if ("LotID".equals(row.getCell(0).toString())) {
				if (row.getCell(2) == null || "".equals(row.getCell(2).toString().trim())) {
					return "上传失败，文件中的批次编号为空值！";
				}
				LotID = row.getCell(2).toString();
				continue;
			}
			if ("DeviceID".equals(row.getCell(0).toString())) {
				if (row.getCell(2) == null || "".equals(row.getCell(2).toString().trim())) {
					return "上传失败，文件中的设备编号为空值！";
				}
				DeviceID = row.getCell(2).toString();
				continue;
			}
			if ("BinTable".equals(row.getCell(0).toString())) {
				limit = true;
				int j = coordinateFlag ? 4 : 2;
				while (row.getCell(j) != null && !"".equals(row.getCell(j).toString().trim())) {
					j++;
				}
				paramNum = j - (coordinateFlag ? 4 : 2);
				continue;
			}
			if (limit) {
				int init = coordinateFlag ? 4 : 2;
				int length = paramNum + init;
				System.out.println(init + "---" + length);
				List<String> list = new ArrayList<String>();
				if (row.getCell(1) == null || "".equals(row.getCell(1).toString().trim())) {
					for (int j = init; j < length; j++) {
						if (row.getCell(j) == null && "".equals(row.getCell(j).toString().trim())) {

							list.add(" , ");
						} else {
							String limits = row.getCell(j).toString();
							if (limits.contains("±")) {
								if (limits.contains("%")) {
									double a = Double.parseDouble(Mediantf(limits));
									double b = Double.parseDouble(PlusMinusf(limits));
									list.add(MaxDefaultType(a, b) + "," + MinDefaultType(a, b));
								} else {
									list.add(SymbolNum(limits) + ",-" + SymbolNum(limits));
								}
							} else if (limits.contains(">")) {
								if (limits.contains("=")) {
									String[] limitArr = limits.split("=");
									list.add("1E+26" + "," + limitArr[1]);
								} else {
									String[] limitArr = limits.split(">");
									list.add("1E+26" + "," + limitArr[1]);
								}

							} else {
								list.add(" , ");
							}
						}
					}
				} else {
					for (int j = init; j < length; j++) {
						if (row.getCell(j) == null || "".equals(row.getCell(j).toString().trim())) {
							if (sheet.getRow(i + 1).getCell(j) == null
									|| "".equals(sheet.getRow(i + 1).getCell(j).toString().trim())) {
								list.add(" , ");
							} else {
								list.add(" ," + sheet.getRow(i + 1).getCell(j).toString());
							}
						} else {
							if (sheet.getRow(i + 1).getCell(j) == null
									|| "".equals(sheet.getRow(i + 1).getCell(j).toString().trim())) {
								list.add(row.getCell(j).toString() + ", ");
							} else {
								list.add(row.getCell(j).toString() + "," + sheet.getRow(i + 1).getCell(j).toString());
							}
						}
					}
					i++;
				}
				limitMap.put(row.getCell(0).toString().trim(), list);
				continue;
			}
			if ("Type".equals(row.getCell(0).toString())) {
				databool = true;
				paramNum = 0;
				int j = 2,count=0;
				if (row.getCell(j) != null) {
					if ("DieX".equalsIgnoreCase(row.getCell(j).toString())) {
						coordinateFlag = true;
						j = 4;
					}
				}
				while (row.getCell(j) != null && !"".equals(row.getCell(j).toString().trim())) {
					count ++;
					paramLs = new ArrayList<>();
					String paramStr = row.getCell(j).toString();
					String[] param = paramStr.split("\\(");
					if (param.length > 1) {
						paramLs.add(param[0]);
						if (param[1].split("\\)").length == 0) {
							paramLs.add("");
						} else {
							paramLs.add(param[1].split("\\)")[0]);
						}
						paramLs.add("C"+count);
					} else {
						paramLs.add(paramStr);
						paramLs.add("");
						paramLs.add("C"+count);
					}
					params.add(paramLs);
					columnStr += ",C"+count;
					condition +=",?";
					j++;
				}
				paramNum = j - 2;
				continue;

			}
			if (databool) {
				if ("Type Yield".equals(row.getCell(0).toString())) {
					continue;
				} else {
						String DieType = row.getCell(0).toString().trim(),value=null;
						List<String> ls = limitMap.get(DieType);
						if (row.getCell(1) == null || !row.getCell(1).toString().contains("/")) {
							continue;
						}
						att = new Object[6+paramNum-1];
						att[0] = row.getCell(1).toString().trim();
						String str = getDieXY(row.getCell(1).toString().trim(), dieLimit);
						att[1] = str.split(",")[0];
						att[2] = str.split(",")[1];
						dieNO++;
						att[3] = dieNO;
						att[5] = 0;
						boolean bin=true;
						if (dieMap.containsKey(DieType)) {
							
							for (int j = 2; j <= paramNum; j++) {
								if (row.getCell(j) == null || "".equals(row.getCell(j).toString().trim())) {
									value = " ";
								} else {
									value = row.getCell(j).toString();
								}
								Matcher isNum = pattern.matcher(value);
								Matcher isNum2 = pattern2.matcher(value);
								if (isNum.matches()) {
								} else if (isNum2.matches()) {
								} else if ("infinity".equals(value)) {
									value = "9E31";
								} else {
									value = "-10000";
								}
								att[5+j-1] = value;
								bin = bin && ((Double.parseDouble(value)>=Double.parseDouble(ls.get(j-2).split(",")[1]) && Double.parseDouble(value)<=Double.parseDouble(ls.get(j-2).split(",")[0])) || value==null ||"".equals(value) );
							}
							att[4] = bin?1:255;
							dieMap.get(DieType).add(att);
						} else {
							dieList = new ArrayList<>();
							for (int j = 2; j <= paramNum; j++) {
								if (row.getCell(j) == null || "".equals(row.getCell(j).toString().trim())) {
									value = " ";
								} else {
									value = row.getCell(j).toString();
								}
								Matcher isNum = pattern.matcher(value);
								Matcher isNum2 = pattern2.matcher(value);
								if (isNum.matches()) {
								} else if (isNum2.matches()) {
								} else if ("infinity".equals(value)) {
									value = "9E31";
								} else {
									value = "-10000";
								}
								att[5+j-1] = value;
								bin = bin && ((Double.parseDouble(value)>=Double.parseDouble(ls.get(j-2).split(",")[1]) && Double.parseDouble(value)<=Double.parseDouble(ls.get(j-2).split(",")[0])) || value==null ||"".equals(value) );
							
							}
							att[4] = bin?1:255;
							dieList.add(att);
							dieMap.put(DieType, dieList);
						}
						datanum++;
				}
			}
		}
		FileName = new File(filepath).getName();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		WaferDO wafer = new WaferDO();
		wafer.setWaferNumber(WaferID);
		wafer.setDeviceNumber(DeviceID);
		wafer.setLotNumber(LotID);
		wafer.setQualifiedRate(Double.parseDouble("0"));
		wafer.setTestStartDate(TestStarTime);
		wafer.setTestEndDate(TestStopTime);
		wafer.setGmtModified(time);
		wafer.setDescription(details);
		wafer.setProductCategory(productCategory);
		wafer.setDataFormat(Integer.parseInt(dataFormat));
		wafer.setGmtCreate(df.format(new Date()));
		wafer.setFileName(FileName);
		wafer.setDeleteStatus(0);
		wafer.setTotalTestQuantity(0);
		map.put("operator", Tester);
		map.put("filepath", filepath);
		map.put("currentUser", currentUser);
		map.put("time", time);
		map.put("computerName", ComputerName);
		map.put("totalTestTime", TotalTestTime);
		map.put("dataFormat", dataFormat);
		map.put("limitMap", limitMap);
		map.put("dataMap", dieMap);
		map.put("paramList", params);
		map.put("columnStr", columnStr.substring(0, columnStr.lastIndexOf(",")));
		map.put("condition", condition.substring(0, condition.lastIndexOf(",")));
		map.put("sizeX",sizeX);
		map.put("sizeY", sizeY);
		System.out.println("读完了么");
//		for(String key:dieMap.keySet()){
//			System.out.println(Arrays.toString(dieMap.get(key).get(0)));
//		}
//		
		WaferService service = new WaferServiceImpl();
		if(conn==null){
			conn = new DataBaseUtil().getConnection();
			try {
				conn.setAutoCommit(false);
				status = service.saveExcelData(conn,map, wafer, coordinateFlag);
			} catch (SQLException e) {
				e.printStackTrace();
			}finally{
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}else{
			status = service.saveExcelData(conn,map, wafer, coordinateFlag);
		}

		return status;
	}
	
	public static void main(String[] args) {
		DataBaseUtil db = new DataBaseUtil();
		String sql = "select alphabetic_coordinate from dm_wafer_coordinate_data where wafer_id=118 limit 0,10";
		List<String> ls = db.queryList(sql, null);
		System.out.println(getDieXY(ls, new String[]{"Y","AB"}));
		
	}

	public static String getDieXY(List<String> coor, String[] coorArr) {
		String mapDirX = "Right";
		String mapDirY = "Down";
		int xOffset = 1;
		int yOffset = 1;
		if (mapDirX != "Right")
			xOffset = 0;
		if (mapDirY != "Top")
			yOffset = 0;
		String markX = coorArr[1];
		int markXCoord = Cal(markX);
		String markY = coorArr[0];
		int markYCoord = Cal(markY);
		int x = 0;
		int y = 0;
		List<Integer> XAxis = new ArrayList<Integer>(), YAxis = new ArrayList<Integer>();
		int maxX = 0, minX = 10000000, maxY = 0, minY = 10000000;
		for (String m : coor) {
			String[] cc = m.split("/");
			x = Cal(cc[1]);
			y = Cal(cc[0]);
			maxX = x > maxX ? x : maxX;
			minX = x < minX ? x : minX;
			maxY = x > maxY ? x : maxY;
			minY = x < minY ? x : minY;
			if (!XAxis.contains(x))
				XAxis.add(x);
			if (!YAxis.contains(y))
				YAxis.add(y);
		}
		int xmean = (maxX + minX) / 2 + xOffset, ymean = (maxY + minY) / 2 + yOffset;
		double sizeX = 200000 / (maxX - minX + 1), sizeY = 200000 / (maxY - minY + 1);

		int xRet = markXCoord - xmean, yRet = markYCoord - ymean;
		String ret = xRet + "," + yRet + "," + sizeX + "," + sizeY;

		return ret;
	}
	
	

	private static int Cal(String s) {
		int ret = 0;
		for (int i = 0; i < s.length(); i++) {
			ret = ret * 26 + s.charAt(i) - 'A' + 1;
		}
		return ret;
	}

	/**
	 * 
	 * @param alphabetic 当前die的字母坐标
	 * @param map 当前晶圆的最大X、Y，最小X、Y
	 * @return
	 */
	public static String getDieXY(String alphabetic,Map<String,Integer> map){
		String mapDirX = "Right";
		String mapDirY = "Down";
		int xOffset = 1;
		int yOffset = 1;
		if (mapDirX != "Right")
			xOffset = 0;
		if (mapDirY != "Top")
			yOffset = 0;
		 String[] coorArr = alphabetic.split("/");
		 int markXCoord = Cal(coorArr[1]),markYCoord = Cal(coorArr[0]),maxX=map.get("maxX"),minX=map.get("minX"),maxY=map.get("maxY"),minY=map.get("minY");
		 int xmean = (maxX + minX) / 2 + xOffset, ymean = (maxY + minY) / 2 + yOffset;
		 int xRet = markXCoord - xmean, yRet = markYCoord - ymean;
		
		 return xRet+","+yRet;
	}
	
	/**
	 * 获取Excel中的晶圆编号
	 * 
	 * @param filepath
	 * @return
	 */
	public static String getExcelWaferNumber(String filepath) {
		String waferNO = "";
		try {
			FileInputStream excelFileInputStream = new FileInputStream(filepath);
			XSSFWorkbook workbook;
			try {
				workbook = new XSSFWorkbook(excelFileInputStream);
				excelFileInputStream.close();
				XSSFSheet sheet = workbook.getSheetAt(0);
				for (int rowIndex = 0; rowIndex <= sheet.getLastRowNum() - 2; rowIndex++) {
					XSSFRow row = sheet.getRow(rowIndex);
					if (rowIndex == 12) {
						if (row.getCell(2) == null) {
							waferNO = "上传失败，文件中的晶圆编号为空值！";
							return waferNO;
						}
						waferNO = row.getCell(2).toString().trim();
						if (!waferNO.equals("")) {
							return waferNO;
						}
					}
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return waferNO;
	}

	public static String readfile(String filepath, String mapfilepath) {
		String filename = "";
		String AlpDiex;
		String AlpDiey;
		String diexanddiey;
		String DieY;
		String DieX;
		String Bin;
		String dietype;
		String exceldiexy;
		String dieno;// 有效dieno
		String Dieno;// 无效dieno
		Map<String, List<String>> map = new HashMap<String, List<String>>();
		Map<String, String> xydieno = new HashMap<String, String>();// 用于存map文件中有效的xy坐标以及dieno
		Map<String, String> Invalidation = new HashMap<String, String>();
		List<String> coordinate = new ArrayList<String>();// 该list装字母坐标。
		List<String> EightParameter = new ArrayList<String>();
		String WaferID = null;// 该ID用于读取数据库中的八个参数。
		WaferID = getExcelWaferNumber(filepath);// 先获取晶圆编号
		EightParameter = ParameterDao.getEightParameter(WaferID);
		// 通过晶圆编号得到转换规则需要的八个参数。
		if (EightParameter.get(0) == null || EightParameter.get(1) == null || EightParameter.get(2) == null
				|| EightParameter.get(3) == null || EightParameter.get(4) == null || EightParameter.get(5) == null
				|| EightParameter.get(6) == null || EightParameter.get(7) == null) {
			filename = "上传失败，导入目标文件前没有导入对应的map文件！";
			// map.put(filename, coordinate);
			return filename;
		}
		try {
			FileInputStream excelFileInputStream = new FileInputStream(filepath);
			try {
				XSSFWorkbook workbook = new XSSFWorkbook(excelFileInputStream);
				excelFileInputStream.close();
				XSSFSheet sheet = workbook.getSheetAt(0);
				StringBuilder employeeInfoBuilder = new StringBuilder();
				int d = 0;// 用来判断dietype有几种。
				StringBuilder DIdLidWid = new StringBuilder();// 用于预存11 12
																// 13行内容的
				int judgeIndex = 0;// 用于读到Type列头所处的行
				int judgeIndex1 = 0;// 用于读到Bintable列头所处行数
				// 拿到excel只中Type所处的那一行的行值。用于dietype有不同类型时能够用该标志判断
				// 存所有的diex以及diey。
				List<Integer> diexall = new ArrayList<Integer>();
				List<Integer> dieyall = new ArrayList<Integer>();
				// 先取到map文件中所有die的信息
				xydieno = GetXYandDieno(mapfilepath, 1);// 取有效的，
				Invalidation = GetXYandDieno(mapfilepath, 2);// 取无效的
				for (int rowIndex = 0; rowIndex <= sheet.getLastRowNum() - 2; rowIndex++) {
					XSSFRow row = sheet.getRow(rowIndex);
					if (row == null) {
						continue;
					}
					XSSFCell judge = row.getCell(0);
					if (judge.toString().equals("Type")) {
						judgeIndex = rowIndex;
					} else if (judge.toString().equals("BinTable")) {
						judgeIndex1 = rowIndex;
					}

				}
				// 假如这个文件中没有这些元素。
				if (judgeIndex == 0 || judgeIndex1 == 0) {
					filename = "上传失败，目标文件内容有误！";
					map.put(filename, coordinate);
					return filename;
				}

				int arraylength = judgeIndex - judgeIndex1;
				int coloumNum = 0;
				while (sheet.getRow(judgeIndex).getCell(coloumNum) != null
						&& !sheet.getRow(judgeIndex).getCell(coloumNum).toString().trim().equals("")) {
					coloumNum++;
				}
				String judgearray[] = new String[arraylength];// 用于存放不同dietype类型
				// 减二的原因是 最后两行可以不用读了。没有用的信息可以舍弃掉
				for (int rowIndex = 0; rowIndex <= sheet.getLastRowNum() - 2; rowIndex++) {
					XSSFRow row = sheet.getRow(rowIndex);
					if (row == null) {
						continue;
					}

					// 考虑到excel文件中
					// filename,teststarttime,teststoptime,totaltime有双引号，而csv中没有
					if (rowIndex < 10) {
						switch (rowIndex) {
						case 0:
							String FileName = row.getCell(0).toString();
							String excelfilename = row.getCell(2).toString();
							if (FileName == null || excelfilename == null) {
								filename = "上传失败，文件中FileName为空！";
								map.put(filename, coordinate);
								return filename;
							}
							String csvfilename = excelfilename.replace("\"", "");
							employeeInfoBuilder.append(FileName + ",," + csvfilename + "\n");
							break;
						case 3:
							String TestStartTime = row.getCell(0).toString();
							String excelstarttime = row.getCell(2).toString();
							String csvstarttime = excelstarttime.replace("\"", "");
							if (row.getCell(2) == null) {
								csvstarttime = null;
							}
							employeeInfoBuilder.append(TestStartTime + ",," + csvstarttime + "\n");
							break;
						case 4:
							String TestStopTime = row.getCell(0).toString();
							String excelstoptime = row.getCell(2).toString();

							String csvstoptime = excelstoptime.replace("\"", "");
							if (row.getCell(2) == null) {
								csvstoptime = null;
							}
							employeeInfoBuilder.append(TestStopTime + ",," + csvstoptime + "\n");
							break;
						case 5:
							String TesttotalTime = row.getCell(0).toString();
							String exceltotaltime = row.getCell(2).toString();
							if (TesttotalTime == null || exceltotaltime == null) {
								filename = "上传失败，文件中TesttotalTime为空！";
								map.put(filename, coordinate);
								return filename;
							}
							String csvstotaltime = exceltotaltime.replace("\"", "");
							employeeInfoBuilder.append(TesttotalTime + ",," + csvstotaltime + "\n");
							break;
						case 9:
							String Yield = row.getCell(0).toString();
							String excelyield = row.getCell(2).toString();
							String csvyield = excelyield.replace("%", "");
							if (row.getCell(2) == null) {
								csvyield = "0";
							}
							employeeInfoBuilder.append(Yield + ",," + csvyield + "\n");
							break;
						}
					}
					// 将11,12,13行的内容先保存在另外一个StringBuilder中。
					// （考虑到csv中这三行内容是在dietype信息之后，而excel在之前，所以先保存）
					else if (rowIndex < 13 && rowIndex > 9) {
						switch (rowIndex) {
						case 10:
							employeeInfoBuilder.append("Operator,,Admin");
							employeeInfoBuilder.append("\n");
							break;
						case 11:
							employeeInfoBuilder.append("TestCondition" + "\n" + "At");
							employeeInfoBuilder.append("\n");
							break;
						case 12:
							employeeInfoBuilder.append("Target");
							employeeInfoBuilder.append("\n");
							if (row.getCell(2) == null) {
								filename = "上传失败，文件中的晶圆编号为空值！";
								return filename;
							}
							WaferID = row.getCell(2).toString().trim();
							break;
						}
						for (int k = 0; k < 3; k++) {
							if (row.getCell(k) == null) {

								String s = "";
								DIdLidWid.append(s + ",");
							} else {
								DIdLidWid.append(row.getCell(k).toString().trim() + ",");
							}
						}
						DIdLidWid.append("\n");
					} else if (rowIndex == judgeIndex1 + 1) {
						// 对默认dietype做判空处理
						if (row.getCell(0) == null) {
							filename = "上传失败，文件中的DieType存在空值！";
							return filename;
						}
						judgearray[d] = row.getCell(0).toString();// 默认dietype存入字符串数组下标为0处

						String limitcontent = "Limit,,,,," + row.getCell(0).toString() + ",Min,";
						String maxcontent = ",,,,,,Max,";
						employeeInfoBuilder.append(limitcontent);
						String max = null;
						String min = null;
						List<String> maxlimit = new ArrayList<String>();// 将最大值存到list中
						for (int k = 2; k < coloumNum - 1; k++)// 循环到有数据行的哪一行。横着走的。
						{
							if (row.getCell(k) == null || row.getCell(k).toString().equals("")) {
								// 此处需要处理上下限不完整的情况
								filename = "上传失败，文件中参数的上下限填写不完整！";
								return filename;
							}
							String limits = row.getCell(k).toString();
							if (limits.contains("±")) {
								if (limits.contains("%")) {
									double a = Double.parseDouble(Mediantf(limits));
									double b = Double.parseDouble(PlusMinusf(limits));
									max = MaxDefaultType(a, b);
									min = MinDefaultType(a, b);
									maxlimit.add(max);
								} else {
									max = "" + SymbolNum(row.getCell(k).toString());
									min = "-" + SymbolNum(row.getCell(k).toString());
									maxlimit.add(max);
								}
							} else if (limits.contains(">")) {
								max = "1E+26";
								maxlimit.add(max);
								if (limits.contains("=")) {
									String[] limit = limits.split("=");
									min = limit[1];
								} else {
									String[] limit = limits.split(">");
									min = limit[1];
								}
							} else {
								filename = "上传失败，文件中参数的上下限填写不完整！";
								return filename;
							}
							employeeInfoBuilder.append(min + ",");
						}
						employeeInfoBuilder.append("\n" + maxcontent);
						for (int m = 0; m < maxlimit.size(); m++) {
							employeeInfoBuilder.append(maxlimit.get(m) + ",");
						}
						employeeInfoBuilder.append("\n");
						//// 若没有其他dietype则将剩余的DeviceID LotId WaferID信息存入。
						if (judgeIndex - judgeIndex1 == 3) {
							employeeInfoBuilder.append("\n" + DIdLidWid + "\n");
						}
					}
					// Type的上两行截止多种dietype
					else if (judgeIndex - 1 > rowIndex && rowIndex > judgeIndex1 + 1) {
						if (row.getCell(0) != null || !row.getCell(0).equals("")
								|| row.getCell(0).getCellType() != HSSFCell.CELL_TYPE_BLANK) {
							d++;
							String dietype1 = row.getCell(0).toString();
							judgearray[d] = dietype1;
							String limitcontent = ",,,,," + dietype1 + ",Min,";
							String maxcontent = ",,,,,,Max,";
							employeeInfoBuilder.append(limitcontent);
							String max = null;
							String min = null;
							List<String> maxlimit = new ArrayList<String>();// 将最大值存到list中。
							for (int k = 2; k < coloumNum - 1; k++) {
								if (row.getCell(k) == null || row.getCell(k).toString().equals("")) {
									// 此处需要处理上下限不完整的情况
									filename = "上传失败，文件中参数的上下限填写不完整！";
									return filename;
								}
								String limits = row.getCell(k).toString();
								if (limits.contains("±")) {
									if (limits.contains("%")) {
										double a = Double.parseDouble(Mediantf(limits));
										double b = Double.parseDouble(PlusMinusf(limits));
										max = MaxDefaultType(a, b);
										min = MinDefaultType(a, b);
										maxlimit.add(max);
									} else {
										max = "" + SymbolNum(row.getCell(k).toString());
										min = "-" + SymbolNum(row.getCell(k).toString());
										maxlimit.add(max);
									}
								} else if (limits.contains(">")) {
									max = "1E+26";
									maxlimit.add(max);
									if (limits.contains("=")) {
										String[] limit = limits.split("=");
										min = limit[1];
									} else {
										String[] limit = limits.split(">");
										min = limit[1];
									}
								} else {
									filename = "上传失败，文件中参数的上下限填写不完整！";
									return filename;
								}
								employeeInfoBuilder.append(min + ",");
							}
							employeeInfoBuilder.append("\n" + maxcontent);
							for (int m = 0; m < maxlimit.size(); m++) {
								employeeInfoBuilder.append(maxlimit.get(m) + ",");
							}
							employeeInfoBuilder.append("\n");
						}
					}
					// 读到judgeindex行的时候需要用csv格式了。插入前面固定的7列。
					else if (rowIndex == judgeIndex) {
						// 若有其他类型的dietype，在读数据行之前将三行ID信息写入
						if (judgeIndex != 17) {
							employeeInfoBuilder.append("\n" + DIdLidWid + "\n");
						}
						// 此处需要将dieposition加入
						String format = "Die X,Die Y,Bin,DieType,Die No,Subsite No,TestTime(ms),";
						employeeInfoBuilder.append(format);
						// 将参数名字加入
						for (int k = 2; k < coloumNum - 1; k++) {

							if (row.getCell(k).toString() == null) {
								filename = "上传失败，文件中参数名称存在空值！";
								map.put(filename, coordinate);
								return filename;
							}

							employeeInfoBuilder.append(row.getCell(k) + ",");
						}
						employeeInfoBuilder.append("\n");
					}
					// 数据行
					else if (rowIndex > judgeIndex) {
						XSSFCell S12 = row.getCell(1);
						String diexy = S12.toString();
						// 该判断是因为在数据行中有一个计算某一种dietype的地方会有一行总结yield的地方 需要去除那一行
						if (diexy.isEmpty()) {
							continue;
						}
						if (!diexy.contains("/")) {
							filename = "上传失败，文件中位置坐标(Coordinate)格式不正确！";
							map.put(filename, coordinate);
							return filename;
						}
						// 获取xy对应的字母
						AlpDiex = diexy.substring(0, diexy.indexOf("/"));
						AlpDiey = diexy.substring(diexy.indexOf("/") + 1, diexy.length());

						// 使用64中转换算法计算出来的。

						diexanddiey = AlpToNumber.DiePositionTrans(AlpDiey, AlpDiex, EightParameter.get(0),
								EightParameter.get(1), EightParameter.get(2), EightParameter.get(3),
								Integer.parseInt(EightParameter.get(4)), Integer.parseInt(EightParameter.get(5)),
								EightParameter.get(6), EightParameter.get(7));
						DieY = diexanddiey.substring(0, diexanddiey.indexOf(","));
						DieX = diexanddiey.substring(diexanddiey.indexOf(",") + 1, diexanddiey.length());
						int diex = Integer.parseInt(DieX);
						int diey = Integer.parseInt(DieY);

						// 将字母转化成数字后加入
						employeeInfoBuilder.append(diex + "," + diey + ",");
						// excel中的qulity对应的bin值
						XSSFCell S3 = row.getCell(coloumNum - 1);

						if (row.getCell(coloumNum - 1) == null) {
							continue;
						}
						Bin = S3.toString();// 可能为Pass或者是Fail
						int bin = 0;// 1或者255
						bin = Bin.equals("Pass") ? 1 : 255;
						// 将bin值加入StringBuilder
						employeeInfoBuilder.append(bin + ",");
						XSSFCell s4 = row.getCell(0);// excel中的defaultType
						dietype = s4.toString();
						if (row.getCell(0) == null) {
							filename = "上传失败，文件中的DieType存在空值！";
							return filename;
						}
						int Dietype = 0;
						for (int s = 0; s < judgearray.length; s++) {
							if (dietype.equals(judgearray[s])) {
								Dietype = s;
							}
						}
						// 将dietype加入到StringBuilder,还有剩余三个默认的0 dieno subsiteno
						// testtime
						// 现在dieno需要从map文件中获取了。先到存内容的Hashmap中取对应的dieno
						exceldiexy = diex + "," + diey;
						dieno = xydieno.get(exceldiexy);
						employeeInfoBuilder.append(Dietype + "," + dieno + "," + 0 + "," + 0 + ",");
						// 将每个参数的值放进去。
						for (int k = 2; k < coloumNum - 1; k++) {
							if (row.getCell(k) == null) {
								employeeInfoBuilder.append(-10000 + ",");
							} else if (row.getCell(k).toString().equals("#NUM!")) {
								employeeInfoBuilder.append("9.9E+40" + ",");
							} else if (row.getCell(k).toString().toLowerCase().equals("infinity")) {
								employeeInfoBuilder.append("9.9E+31" + ",");
							} else {
								employeeInfoBuilder.append(row.getCell(k) + ",");
							}
						}

						employeeInfoBuilder.append("\n");
					}
				}
				// 需要在此处将无效die的信息都放进去。除了xy以及dieno 的值，Bin给-1；其余的都给0；
				for (String diexdiey : Invalidation.keySet()) {
					String[] xy = diexdiey.split(",");
					Dieno = Invalidation.get(diexdiey);
					employeeInfoBuilder.append(xy[0] + "," + xy[1] + "," + "-1,0," + Dieno + ",0,0," + "\n");
				}
				filename = employeeInfoBuilder.toString();

			} catch (IOException e) {
				e.printStackTrace();
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return filename;
	}

	// 读取map文件 返回xy坐标 和编号
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
	 * 自动抓取
	 * 
	 * @param filepath
	 * @param productcatagories
	 * @param testOperator
	 * @param details
	 * @param diaryUsername
	 * @param DataFormat
	 * @return
	 * @throws Exception
	 */
	public static String getExcelDataAuto(String filepath, String productcatagories, String testOperator,
			String details, String diaryUsername, String DataFormat) throws Exception {
		boolean limit = false;
		boolean databool = false;
		int datanum = 1;
		Date date = new Date();
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time = format.format(date);
		FileInputStream excelFileInputStream = new FileInputStream(filepath);
		XSSFWorkbook workbook = new XSSFWorkbook(excelFileInputStream);
		excelFileInputStream.close();
		XSSFSheet sheet = workbook.getSheetAt(0);
		int paramNum = 0;
		// 变量定义
		String Tester = "";
		String TestStarTime = "";
		String TestStopTime = "";
		String WaferID = "";
		String LotID = "";
		String DeviceID = "";
		String FileName = "";
		String ComputerName = "";
		String TotalTestTime = "";
		boolean coordinateFlag = false;
		// 存放上下限
		Map<String, List<String>> limitMap = new HashMap<String, List<String>>();
		// 存放数据
		Map<String, List<String>> dataMap = new HashMap<String, List<String>>();
		// 存放参数
		List<String> paramList = new ArrayList<String>();
		// 存放参数单位
		List<String> unitList = new ArrayList<String>();
		// 存放坐标
		List<String> positionList = new ArrayList<String>();

		for (int i = 0; i <= sheet.getLastRowNum(); i++) {
			XSSFRow row = sheet.getRow(i);
			if (row == null || row.getCell(0) == null || "".equals(row.getCell(0).toString())) {
				continue;

			}
			if ("Type".equals(row.getCell(0).toString()) && "DieX".equals(row.getCell(2).toString())) {
				coordinateFlag = true;
				break;
			}
		}
		for (int i = 0; i <= sheet.getLastRowNum(); i++) {
			XSSFRow row = sheet.getRow(i);
			if (row == null) {
				limit = false;
				continue;

			}
			if ((row.getCell(0) == null || "".equals(row.getCell(0).toString()))
					&& (row.getCell(1) == null || "".equals(row.getCell(1).toString()))) {
				limit = false;
				continue;
			}
			if ("FileName".equals(row.getCell(0).toString())) {
				if (row.getCell(2) != null) {
					FileName = row.getCell(2).toString();
				}
			}
			if ("ComputerName".equals(row.getCell(0).toString())) {
				if (row.getCell(2) != null) {
					ComputerName = row.getCell(2).toString();
				}
			}
			if ("TotalTestTime".equals(row.getCell(0).toString())) {
				if (row.getCell(2) != null) {
					TotalTestTime = row.getCell(2).toString();
				}
			}
			if ("Tester".equals(row.getCell(0).toString())) {
				if (row.getCell(2) == null || "".equals(row.getCell(2).toString().trim())) {
					Tester = testOperator;
				} else {
					Tester = row.getCell(2).toString();
				}
				continue;
			}
			if ("TestStarTime".equals(row.getCell(0).toString())) {
				if (row.getCell(2) == null || "".equals(row.getCell(2).toString().trim())) {
					TestStarTime = time;
				} else {

					TestStarTime = row.getCell(2).toString().split("\"")[1];

				}
				continue;
			}
			if ("TestStopTime".equals(row.getCell(0).toString())) {
				if (row.getCell(2) == null || "".equals(row.getCell(2).toString().trim())) {
					TestStopTime = time;
				} else {
					TestStopTime = row.getCell(2).toString().split("\"")[1];
				}
				continue;
			}
			if ("WaferID".equals(row.getCell(0).toString())) {
				if (row.getCell(2) == null || "".equals(row.getCell(2).toString().trim())) {
					return "上传失败，文件中的晶圆编号为空值！";
				}
				WaferID = row.getCell(2).toString().trim();
				continue;
			}
			if ("LotID".equals(row.getCell(0).toString())) {
				if (row.getCell(2) == null || "".equals(row.getCell(2).toString().trim())) {
					return "上传失败，文件中的批次编号为空值！";
				}
				LotID = row.getCell(2).toString();
				continue;
			}
			if ("DeviceID".equals(row.getCell(0).toString())) {
				if (row.getCell(2) == null || "".equals(row.getCell(2).toString().trim())) {
					return "上传失败，文件中的设备编号为空值！";
				}
				DeviceID = row.getCell(2).toString();
				continue;
			}
			if ("BinTable".equals(row.getCell(0).toString())) {
				limit = true;
				int j = coordinateFlag ? 4 : 2;
				while (row.getCell(j) != null && !"".equals(row.getCell(j).toString().trim())) {
					j++;
				}
				paramNum = j - (coordinateFlag ? 4 : 2);
				continue;
			}
			if (limit) {
				int init = coordinateFlag ? 4 : 2;
				int length = paramNum + init;
				List<String> list = new ArrayList<String>();
				if (row.getCell(1) == null || "".equals(row.getCell(1).toString().trim())) {
					for (int j = init; j < length; j++) {
						if (row.getCell(j) == null && "".equals(row.getCell(j).toString().trim())) {

							list.add(" , ");
						} else {
							String limits = row.getCell(j).toString();
							if (limits.contains("±")) {
								if (limits.contains("%")) {
									double a = Double.parseDouble(Mediantf(limits));
									double b = Double.parseDouble(PlusMinusf(limits));
									list.add(MaxDefaultType(a, b) + "," + MinDefaultType(a, b));
								} else {
									list.add(SymbolNum(limits) + ",-" + SymbolNum(limits));
								}
							} else if (limits.contains(">")) {
								if (limits.contains("=")) {
									String[] limitArr = limits.split("=");
									list.add("1E+26" + "," + limitArr[1]);
								} else {
									String[] limitArr = limits.split(">");
									list.add("1E+26" + "," + limitArr[1]);
								}

							} else {
								list.add(" , ");
							}
						}
					}
				} else {
					for (int j = init; j < length; j++) {
						if (row.getCell(j) == null || "".equals(row.getCell(j).toString().trim())) {
							if (sheet.getRow(i + 1).getCell(j) == null
									|| "".equals(sheet.getRow(i + 1).getCell(j).toString().trim())) {
								list.add(" , ");
							} else {
								list.add(" ," + sheet.getRow(i + 1).getCell(j).toString());
							}
						} else {
							if (sheet.getRow(i + 1).getCell(j) == null
									|| "".equals(sheet.getRow(i + 1).getCell(j).toString().trim())) {
								list.add(row.getCell(j).toString() + ", ");
							} else {
								list.add(row.getCell(j).toString() + "," + sheet.getRow(i + 1).getCell(j).toString());
							}
						}
					}
					i++;
				}
				limitMap.put(row.getCell(0).toString().trim(), list);
				continue;
			}
			if ("Type".equals(row.getCell(0).toString())) {
				databool = true;
				paramNum = 0;
				int j = 2;
				if (row.getCell(j) != null) {
					if ("DieX".equalsIgnoreCase(row.getCell(j).toString())) {
						coordinateFlag = true;
						j = 4;
					}
				}
				while (row.getCell(j) != null && !"".equals(row.getCell(j).toString().trim())) {
					String paramStr = row.getCell(j).toString();
					String[] param = paramStr.split("\\(");
					if (param.length > 1) {
						paramList.add(param[0]);
						if (param[1].split("\\)").length == 0) {
							unitList.add("");
						} else {
							unitList.add(param[1].split("\\)")[0]);
						}
					} else {
						paramList.add(paramStr);
						unitList.add("");
					}
					j++;
				}
				// paramNum = coordinateFlag?j-4:j-2;
				paramNum = j - 2;
				continue;

			}
			if (databool) {
				if ("Type Yield".equals(row.getCell(0).toString())) {
					continue;
				} else {
					if (positionList.contains(row.getCell(1).toString().trim())) {
						continue;
					} else {
						positionList.add(row.getCell(1).toString().trim());
						String DieType = row.getCell(0).toString().trim();
						if (row.getCell(1) == null || !row.getCell(1).toString().contains("/")) {
							continue;
						}
						if (dataMap.containsKey(DieType)) {
							StringBuilder dataStr = new StringBuilder();
							for (int j = 1; j <= paramNum; j++) {
								if (row.getCell(j) == null || "".equals(row.getCell(j).toString().trim())) {
									dataStr.append(" ,");
								} else {
									dataStr.append(row.getCell(j).toString() + ",");
								}
							}
							dataStr.append(datanum);
							dataMap.get(DieType).add(dataStr.toString());
						} else {
							List<String> list = new ArrayList<String>();
							StringBuilder dataStr = new StringBuilder();
							for (int j = 1; j <= paramNum; j++) {
								if (row.getCell(j) == null || "".equals(row.getCell(j).toString().trim())) {
									dataStr.append(" ,");
								} else {
									dataStr.append(row.getCell(j).toString() + ",");
								}
							}
							dataStr.append(datanum);
							list.add(dataStr.toString());
							dataMap.put(DieType, list);
						}
						datanum++;
					}
				}
			}
		}
////		FileDao dao = new FileDao();
//		String result = dao.saveExcelDataAuto(WaferID, LotID, DeviceID, Tester, TestStarTime, TestStopTime, filepath,
//				productcatagories, testOperator, details, diaryUsername, limitMap, dataMap, paramList, unitList, time,
//				datanum, FileName, ComputerName, TotalTestTime, DataFormat, coordinateFlag);
//		System.out.println("自动抓取存储完毕");
//		return result;
		return null;
	}
}
