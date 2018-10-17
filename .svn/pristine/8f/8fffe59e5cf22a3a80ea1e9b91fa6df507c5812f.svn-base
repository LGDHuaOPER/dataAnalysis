package com.eoulu.transfer;

import java.util.Date;

/**
 * 创建时间 2017-3-13
 * 创建人：左攀
 * 该类主要用于excel文件中 字母转成数字的算法。 
 * */
public class AlpToNumber {
	static String TransferDieX=null;//
    static String TransferDieY=null;//
    static String DieXandDieY=null;
	
    public static String DiePositionTrans(String diex,              //待计算的x坐标
							            String diey,             //待计算的y坐标
							            String DirectionX,  //map图X方向
							            String DirectionY,  //map图Y方向
							            String SetCoorX,    //X增长方向
							            String SetCoorY,    //Y增长方向
							            int SetCoorDieX,    //转换参考坐标X
							            int SetCoorDieY,    //转换参考坐标Y
							            String StandCoorDieX,//参考坐标X
							            String StandCoorDieY)//参考坐标Y
    { 
    int tx = ColumnToIndex(StandCoorDieX);   //参考坐标的字母转换成数字，便于计算
    int ty = ColumnToIndex(StandCoorDieY);   //参考坐标的字母转换成数字，便于计算
    //计算出计算坐标x，y
    int x=ColumnToIndex(diex);
    int y=ColumnToIndex(diey);
    int gapX,gapY;
    
    if (DirectionX .equals("Left") && DirectionY.equals("Top"))//分4种情况计算，每种情况计算形式
    {
    	 // #region
        if (SetCoorX.equals("Left") && SetCoorY .equals( "Top"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x < 0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y <0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else  if(tx - x >=0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }   
        }
        // #region
        else  if (SetCoorX.equals("Left") && SetCoorY.equals("Down"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x < 0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y < 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else  if(tx - x >=0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
        }
        // #region
        else  if (SetCoorX.equals("Right") && SetCoorY.equals( "Top"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else   if(tx - x < 0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else   if(tx - x >=0 && ty - y < 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
        }
     // #region
        else  if (SetCoorX .equals( "Right") && SetCoorY.equals("Down"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x < 0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else  if(tx - x >=0 && ty - y < 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else  if(tx - x >=0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
        } 
    }
    
    else if (DirectionX.equals("Left") && DirectionY.equals("Down"))
    {
       // #region
        if (SetCoorX.equals("Left") && SetCoorY.equals("Top"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x < 0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else  if(tx - x >=0 && ty - y <0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else  if(tx - x >=0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }   
        }
        // #region
        else   if (SetCoorX.equals("Left") && SetCoorY.equals("Down"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x < 0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else  if(tx - x >=0 && ty - y < 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else  if(tx - x >=0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
        }
        // #region
        else  if (SetCoorX.equals("Right") && SetCoorY.equals("Top"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x < 0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else  if(tx - x >=0 && ty - y < 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
        }
     // #region
        else  if (SetCoorX.equals("Right") && SetCoorY.equals("Down"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x < 0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y < 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
        }    
    }
    else if (DirectionX .equals("Right") && DirectionY.equals("Top"))
    {
		// #region
        if (SetCoorX.equals("Left") && SetCoorY.equals("Top"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else  if(tx - x < 0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y <0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }   
        }
        // #region
        else  if (SetCoorX.equals("Left") && SetCoorY.equals("Down"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else   if(tx - x < 0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y < 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else  if(tx - x >=0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
        }
        // #region
        else   if (SetCoorX.equals("Right") && SetCoorY.equals("Top"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x < 0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y < 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
        }
     // #region
        else  if (SetCoorX.equals("Right") && SetCoorY.equals("Down"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY -gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x < 0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y < 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
        }    
    }
    else if (DirectionX.equals("Right") && DirectionY.equals("Down"))
    {
		// #region
        if (SetCoorX.equals("Left") && SetCoorY.equals("Top"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x < 0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y <0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else  if(tx - x >=0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }   
        }
        // #region
        else if (SetCoorX.equals("Left") && SetCoorY.equals("Down"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x < 0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y < 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
        }
        // #region
        else if (SetCoorX.equals("Right") && SetCoorY.equals("Top"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x < 0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else  if(tx - x >=0 && ty - y < 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
        }
     // #region
        else if (SetCoorX.equals("Right" )&& SetCoorY.equals( "Down"))
        {
            
            if (tx - x < 0 && ty - y < 0)
            {
                gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x < 0 && ty - y >= 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX + gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y < 0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY + gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
            else if(tx - x >=0 && ty - y >=0)
            {
            	gapX = Math.abs(tx - x);
                gapY = Math.abs(ty - y);
                TransferDieY = String.valueOf(SetCoorDieX - gapX);
                TransferDieX= String.valueOf(SetCoorDieY - gapY);
                DieXandDieY=TransferDieX+","+TransferDieY;
                return DieXandDieY;
            }
        }    
    }
    
	
	
	
	return DieXandDieY;
}
        //数字转化成字母
	private static String Convert2Letter(int num)
	{
		Date date=new Date();
	    int index = num;
	    if (index < 0)
	    {
	        //throw new Exception("Invalid parameter");//鍘熸潵浠ｇ爜锛屾湭澶勭悊
	       return "-"+date.getTime()+Math.random();
	    }
	    index--;
	    String column = "";
	    do
	    {
	        if (column.length() > 0)
	        {
	            index--;
	        }
	        column = ((char)(index % 26 + (int)'A')) + column;//yougaidog
	        index = (int)((index - index % 26) / 26);
	    } while (index > 0);
	    return column;
	}
	  public static int ColumnToIndex(String column)
        { 
           /* if (!Regex.IsMatch(column.toUpperCase(), @"[A-Z]+"))
            {
                throw new Exception("Invalid parameter");
            }
            */
            int index = 0;
            char[] chars = column.toUpperCase().toCharArray();
            for (int i = 0; i < chars.length; i++)
            {
                index += ((int)chars[i] - (int)'A' + 1) * (int)Math.pow(26, chars.length - i - 1);
            }
            return index;
        }
	  public static void main(String args[])
	  {
		  AlpToNumber atn=new AlpToNumber();
		  String ss=atn.DiePositionTrans("Z", "A", "Left", "Down", "Right", "Down", 4,-27, "Y", "A");
		  System.out.println(ss);
	  }
}
