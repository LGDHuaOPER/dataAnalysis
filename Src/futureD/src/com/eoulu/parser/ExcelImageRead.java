package com.eoulu.parser;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;  
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;  
import java.io.IOException;  
import java.io.InputStream;
import java.util.ArrayList;  
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;  
import java.util.Map;
import java.util.Properties;

import org.apache.catalina.tribes.util.Arrays;
import org.apache.poi.POIXMLDocumentPart;  
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;  
import org.apache.poi.ss.usermodel.PictureData;  
import org.apache.poi.ss.usermodel.Sheet;  
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFClientAnchor;  
import org.apache.poi.xssf.usermodel.XSSFDrawing;  
import org.apache.poi.xssf.usermodel.XSSFPicture;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFShape;  
import org.apache.poi.xssf.usermodel.XSSFSheet;  
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.freehep.graphicsio.emf.EMFInputStream;
import org.freehep.graphicsio.emf.EMFRenderer;
import org.openxmlformats.schemas.drawingml.x2006.spreadsheetDrawing.CTMarker;

import com.eoulu.util.DataBaseUtil;


import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;

public class ExcelImageRead {
	
	
	public static void main(String[] args) throws IOException, InvalidFormatException {
		String path = "D:\\孟迪\\EDM项目\\需求\\1808\\0814\\上传\\新excel数据\\waferNewTest.xlsx";//"E:/test/testImage.xlsx";
		long time0 = System.currentTimeMillis();
		 File file = new File(path);  
         
	        // 创建流  
	        InputStream input = new FileInputStream(file);  
	          
	        // 获取文件后缀名  
	        String fileExt =  file.getName().substring(file.getName().lastIndexOf(".") + 1);  
	          
	        // 创建Workbook  
	        Workbook wb = new XSSFWorkbook(input);    
	          
	        // 创建sheet  
	        Sheet sheet = null;  
	  
	        //获取excel sheet总数  
	        int sheetNumbers = wb.getNumberOfSheets();  
	          System.out.println("sheetNumbers:"+sheetNumbers);
	        // sheet list  
	        List<Map<String, PictureData>> sheetList = null;  
	        String destination = "D:\\EDM\\WaferImage\\wafer\\";  
	        String suffix = "png";
	        // 循环sheet  
	        for (int i = 1; i < sheetNumbers; i++) {  
	        	sheetList = new ArrayList<Map<String, PictureData>>();  
	            sheet = wb.getSheetAt(i);  
	            // map等待存储excel图片  
	            Map<String, PictureData> sheetIndexPicMap;   
	            //获取图片  
	             sheetIndexPicMap = getSheetPictrue(i, (XSSFSheet) sheet, (XSSFWorkbook) wb);  
	            // 将当前sheet图片map存入list  
	            sheetList.add(sheetIndexPicMap);  
	            if(i==2){
	            	printImg(sheetList,destination+"温度曲线\\",suffix); 
	            }
	            if(i==1){
	            	printImg(sheetList,destination+"稳定性\\",suffix); 
	            }
	            
	        }  
	          
	        long time = System.currentTimeMillis();
	        System.out.println("end");
	        System.out.println(time-time0);

		
	}
	
	public static void readImageOfExcel(String path,String suffix) {
		File file = new File(path);
		String fileName = file.getName().substring(0, file.getName().indexOf("."));
		List<Map<String, PictureData>> sheetList = null;
		try {
			Properties pro = new Properties();
			pro.load(DataBaseUtil.class.getResourceAsStream("FilePath.properties"));
			String destination = pro.getProperty("rootUrl")+fileName+"/";
			// 创建流
			InputStream input = new FileInputStream(file);
			// 创建Workbook
			Workbook wb = new XSSFWorkbook(input);
			// 创建sheet
			Sheet sheet = null;
			// 获取excel sheet总数
			int sheetNumbers = wb.getNumberOfSheets();
			for (int i = 1; i < sheetNumbers; i++) {
				sheetList = new ArrayList<Map<String, PictureData>>();
				sheet = wb.getSheetAt(i);
				Map<String, PictureData> sheetIndexPicMap;
				// 获取图片
				sheetIndexPicMap = getSheetPictrue(i, (XSSFSheet) sheet, (XSSFWorkbook) wb);
				sheetList.add(sheetIndexPicMap);
				if (i == 2) {
					File destFile = new File(destination+ "温度曲线/");
					if(!destFile.exists() || !destFile.isDirectory()){
						destFile.mkdirs();
					}
					printImg(sheetList, destination + "温度曲线/", suffix);
				}
				if (i == 1) {
					File destFile = new File(destination+  "稳定性/");
					if(!destFile.exists() || !destFile.isDirectory()){
						destFile.mkdirs();
					}
					printImg(sheetList, destination + "稳定性/", suffix);
				}

			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static Map<String, PictureData> getSheetPictrue(int sheetNum,  
            XSSFSheet sheet, XSSFWorkbook workbook) {  
        Map<String, PictureData> sheetIndexPicMap = new LinkedHashMap<>();  
        int rowCounts = sheet.getLastRowNum();
        int rowIndex = sheet.getFirstRowNum();
        List<String> dienos = new ArrayList<>();
        String value = "";
        for(int i=rowIndex;i<rowCounts;i++){
        	XSSFRow row = sheet.getRow(i);
        	if(row==null){
        		continue;
        	}
        	 XSSFCell cell = row.getCell(0);
        	 if(cell==null){
        		 continue;
        	 }
        	 value = cell.toString();
        	if(!"".equals(value)){
        		dienos.add(value);
        	}
        }
        int count = 0;
        for (POIXMLDocumentPart dr : sheet.getRelations()) {  
            if (dr instanceof XSSFDrawing) {  
                XSSFDrawing drawing = (XSSFDrawing) dr;  
                List<XSSFShape> shapes = drawing.getShapes();  
                int index = 0;
                int picCount = 0;
                String dieno = "";
                for (XSSFShape shape : shapes) { 
                    XSSFPicture pic = (XSSFPicture) shape;  
                    XSSFClientAnchor anchor = pic.getPreferredSize();  
//                    CTMarker ctMarker = anchor.getFrom();  
//                    String picIndex = String.valueOf(sheetNum) + "_"  
//                            + ctMarker.getRow() + "_" + ctMarker.getCol();  
//                    tempIndexPicMap.put(picIndex, pic.getPictureData());  
                    if(index == 0){
                    	index = anchor.getRow1();
                    	dieno = dienos.get(count);
                    }
                    if(index!=anchor.getRow1()){
                    	count ++ ;
                    	picCount=1;
                    	dieno = dienos.get(count);
                    	index = anchor.getRow1();
                    	sheetIndexPicMap.put(dieno+"("+picCount+")", pic.getPictureData());
                    }else{
                    	picCount ++;
                    	sheetIndexPicMap.put(dieno+"("+picCount+")", pic.getPictureData());
                    }
                    System.out.println(count);
                    System.out.println("起始单元格"+String.valueOf(anchor.getRow1())+","+String.valueOf(anchor.getCol1()));
                }  
            }  
        }  
        System.out.println(sheetIndexPicMap.size());
        System.out.println(sheetIndexPicMap.get(2));
        return sheetIndexPicMap;  
    }  

	/**
	 * 
	 * @param sheetList  
	 * @param destination
	 * @param suffix
	 * @throws IOException
	 */
	 public static void printImg(List<Map<String, PictureData>> sheetList,String destination,String suffix) throws IOException {  
         
	        for (Map<String, PictureData> map : sheetList) {  
	            Object key[] = map.keySet().toArray();  
	            for (int i = 0; i < map.size(); i++) {  
	                // 获取图片流  
	                PictureData pic = map.get(key[i]);  
	                // 获取图片索引  
	                String picName = key[i].toString();  
	                // 获取图片格式  
	                String ext = pic.suggestFileExtension();  
	                byte[] data = pic.getData(); 
	                byte[] stream = null;
	                if(!"".equals(suffix)){
	                	InputStream is = byte2Input(data);
		                stream = emfToPng(is);
	                }
	                FileOutputStream out = new FileOutputStream(destination + picName +"."+ ("".equals(suffix)?ext:suffix) );  
	                if(!"".equals(suffix)){
	                	out.write(stream);
	                }else{
	                	 out.write(data);  
	                }
	                out.close();  
	            }  
	        }  
	          
	    }  
		
		private static byte[] emfToPng(InputStream is){
			// InputStream inputStream=null;
			byte[] by=null;
			EMFInputStream emf = null; 
			EMFRenderer emfRenderer = null; 
			//创建储存图片二进制流的输出流
			ByteArrayOutputStream baos = null;
			//创建ImageOutputStream流
			ImageOutputStream imageOutputStream = null;
			try { 
			emf = new EMFInputStream(is, EMFInputStream.DEFAULT_VERSION); 
			emfRenderer = new EMFRenderer(emf); 

			final int width = (int)emf.readHeader().getBounds().getWidth(); 
			final int height = (int)emf.readHeader().getBounds().getHeight(); 
			final BufferedImage result = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB); //TYPE_INT_ARGB
			Graphics2D g2 = (Graphics2D)result.createGraphics(); 
			emfRenderer.paint(g2); 

			//创建储存图片二进制流的输出流
			baos = new ByteArrayOutputStream();
			//创建ImageOutputStream流
			imageOutputStream = ImageIO.createImageOutputStream(baos);
			//将二进制数据写进ByteArrayOutputStream
			ImageIO.write(result, "png", imageOutputStream);
			//inputStream = new ByteArrayInputStream(baos.toByteArray());
			by=baos.toByteArray();
			/*JPanel resultPanel = new JPanel() { 

			private static final long serialVersionUID = 1L; 

			public void paintComponent(Graphics g) { 
			super.paintChildren(g); 
			Graphics2D g2 = (Graphics2D)g; 
			g2.drawImage(result, 0, 0, width, height,null); 
			g2.dispose();
			} 
			};

			JFrame ui = new JFrame("EMF Reader"); 
			ui.getContentPane().setLayout(new BorderLayout()); 
			ui.getContentPane().add(resultPanel, BorderLayout.CENTER); 
			ui.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE); 
			ui.setSize(new Dimension(width, height)); 
			ui.setVisible(true);*/
			} catch (FileNotFoundException e) { 
			e.printStackTrace(); 
			} catch (IOException e) { 
			e.printStackTrace(); 
			} finally{
			try {
			if(imageOutputStream!=null){
			imageOutputStream.close();
			}
			if(baos!=null){
			baos.close();
			}
			if(emfRenderer!=null){
			emfRenderer.closeFigure();
			}
			if(emf!=null){
			emf.close(); 
			}
			} catch (IOException e) {
			e.printStackTrace();
			}

			}
			return by;
			}
		
		/**
		 * 
		 * @param buf
		 * @return
		 */
		public static final InputStream byte2Input(byte[] buf) {  
			        return new ByteArrayInputStream(buf);  
			    }  
		
}
