/**
 * 
 */
package com.eoulu.parser;

import java.io.FileOutputStream;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/**
 * @author mengdi
 *
 * 
 */
public class WriteExcel {

	/**
	 * EOULU标准格式导出
	 * @param path
	 * @param dataList
	 * @param paramMap
	 * @param secondary
	 * @param yield
	 * @param yieldList
	 */
	public static void exportExcel(String path, List<Map<String, Object>> dataList, Map<String, Object> paramMap,
			List<Map<String, Object>> secondary, List<Map<String,Object>> yield, List<Double> yieldList) {
		double qualifiedRate = Double.parseDouble(yield.get(0).get("yield").toString());
		int quantity = Integer.parseInt(yield.get(0).get("quantity").toString()), passed = (int) (quantity * qualifiedRate),
				failed = quantity - passed, start = 15 + 2;
		List<String> paramList = (List<String>) paramMap.get("paramList");
		List<String> upperList = (List<String>) paramMap.get("upperList");
		List<String> lowerList = (List<String>) paramMap.get("lowerList");
		String[] att = new String[] { "FileName", "ComputerName", "Tester", "TestStarTime", "TestStopTime",
				"TotalTestTime", "TotalTested", "Passed", "Failed", "Yield(%)", "DeviceID", "LotID", "WaferID" };
		XSSFWorkbook wb = new XSSFWorkbook();
		XSSFSheet sheet = wb.createSheet("sheet0");
		// 次要信息
		for (int i = 0, length = att.length; i < length; i++) {
			XSSFRow row = sheet.createRow(i);
			XSSFCell cell = row.createCell(0);
			cell.setCellValue(att[i]);
			XSSFCell c = row.createCell(1);
			if (i == 6) {
				c.setCellValue(quantity);
				continue;
			}
			if (i == 7) {
				c.setCellValue(passed);
				continue;
			}
			if (i == 8) {
				c.setCellValue(failed);
				continue;
			}
			if (i == 9) {
				c.setCellValue((qualifiedRate*100)+"%");
				continue;
			}
			if ("FileName".equals(att[i])) {
				c.setCellValue(secondary.get(0).get("wafer_file_name").toString());
				continue;
			}
			if ("ComputerName".equals(att[i])) {
				c.setCellValue(secondary.get(0).get("computer_name").toString());
				continue;
			}
			if ("Tester".equals(att[i])) {
				c.setCellValue(secondary.get(0).get("tester").toString());
				continue;
			}
			if ("TestStarTime".equals(att[i])) {
				c.setCellValue(secondary.get(0).get("test_start_date").toString());
				continue;
			}
			if ("TestStopTime".equals(att[i])) {
				c.setCellValue(secondary.get(0).get("test_end_date").toString());
				continue;
			}
			if ("TotalTestTime".equals(att[i])) {
				c.setCellValue(secondary.get(0).get("total_test_time").toString());
				continue;
			}
			if ("DeviceID".equals(att[i])) {
				c.setCellValue(secondary.get(0).get("device_number").toString());
				continue;
			}
			if ("LotID".equals(att[i])) {
				c.setCellValue(secondary.get(0).get("lot_number").toString());
				continue;
			}
			if ("WaferID".equals(att[i])) {
				c.setCellValue(secondary.get(0).get("wafer_number").toString());
				continue;
			}

		}
		// 参数
		XSSFRow row14 = sheet.createRow(14);
		XSSFCell cel14 = row14.createCell(0);
		cel14.setCellValue("BinTable");
		for (int i = 2, size = paramList.size() + 2; i < size; i++) {
			XSSFCell cell = row14.createCell(i);
			cell.setCellValue(paramList.get(i - 2));
		}
		// 器件类型与对应的上下限
		XSSFRow row15 = sheet.createRow(15);
		XSSFCell cel15 = row15.createCell(0);
		cel15.setCellValue(secondary.get(0).get("die_type").toString());
		if (upperList.size() > 0) {
			XSSFCell cmax = row15.createCell(1);
			cmax.setCellValue("max");
			for (int i = 2, size = upperList.size() + 2; i < size; i++) {
				XSSFCell c = row15.createCell(i);
				if ("".equals(upperList.get(i - 2))) {
					c.setCellValue("");
				} else {
					c.setCellValue(upperList.get(i - 2));
				}
			}
			XSSFRow row16 = sheet.createRow(16);
			XSSFCell cmin = row16.createCell(1);
			cmin.setCellValue("min");
			for (int i = 2, size = lowerList.size() + 2; i < size; i++) {
				XSSFCell c = row16.createCell(i);
				if ("".equals(lowerList.get(i - 2))) {
					c.setCellValue("");
				} else {
					c.setCellValue(lowerList.get(i - 2));
				}
			}
			start = 14 + 4;
		}
		// 参数以及参数标题
		XSSFRow title = sheet.createRow(start);
		for (int i = 0, size = paramList.size() + 3; i < size; i++) {
			XSSFCell c = title.createCell(i);
			if (i == 0) {
				c.setCellValue("Type");
				continue;
			}
			if (i == 1) {
				c.setCellValue("Coordinate");
				continue;
			}
			if (i == size - 1) {
				c.setCellValue("Quality");
				continue;
			}
			c.setCellValue(paramList.get(i - 2));
		}
		Font font = wb.createFont();
		XSSFCellStyle cellStyle = wb.createCellStyle();
		font.setColor(IndexedColors.RED.getIndex());
		cellStyle.setFont(font);
		// die数据
		String value = "";
		Map<String, Object> data = null;
		System.out.println(start + 1);
		System.out.println(dataList.size());
		for (int k = start + 1, size = dataList.size()+start+1; k < size; k++) {
			data = dataList.get(k-start-1);
			XSSFRow r = sheet.createRow(k);
			for (int i = 0, size2 = paramList.size() + 3; i < size2; i++) {
				XSSFCell cell = r.createCell(i);
				if (i == 0) {
					value = secondary.get(0).get("die_type").toString();
					cell.setCellValue(value);
					continue;
				}
				if (i == 1) {
					value = data.get("location").toString();
					cell.setCellValue(value);
					continue;
				}
				if (i == size2 - 1) {
					value = "1".equals(data.get("bin").toString()) ? "Pass" : "Fail";
					cell.setCellValue(value);
					continue;
				}
				if (i > 1 && i < size2 - 1) {
					value = data.get("C" + (i - 1)).toString();
					cell.setCellValue(Double.parseDouble(value));
					if (!("".equals(upperList.get(i - 2)) || "".equals(lowerList.get(i - 2))
							|| (Double.parseDouble(value) >= Double.parseDouble(lowerList.get(i - 2))
							&& Double.parseDouble(value) <= Double.parseDouble(upperList.get(i - 2))))) {
						cell.setCellStyle(cellStyle);
					}
				}
			}

		}
		XSSFRow r = sheet.createRow(start+1+dataList.size());
		XSSFCell cell0 = r.createCell(0);
		cell0.setCellValue("Type Yield");
		for(int i=2,size=yieldList.size()+2;i<size;i++){
			XSSFCell cell = r.createCell(i);
			cell.setCellValue((yieldList.get(i-2)*100)+"%");
		}
		FileOutputStream output;
		try {
			output = new FileOutputStream(path);
			wb.write(output);
			output.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
