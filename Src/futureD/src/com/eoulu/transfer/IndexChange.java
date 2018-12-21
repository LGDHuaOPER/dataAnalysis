package com.eoulu.transfer;

import java.util.Date;

//该类是有方向以及参考点 算出来的
public class IndexChange {

	 //X Y 坐标的转换
    //DirectionX DirectionY Map图的坐标轴
    //x,y表示Die在Map图中的位置
    //SetCoorX SetCoorY表示设置的转换后字符的增长方向
	
    //SetCoorDieX SetCoorDieX设置的标准的Die的XY坐标
    //StandCoorDieX StandCoorDieY标准坐标对应的字符
	
    //TransferDieX TransferDieY转换后的XY的字符坐标
    //#region X Y 坐标的转换
	static String TransferDieX=null;//
    static String TransferDieY=null;//
    static String DieXandDieY=null;
    public static String DiePositionTrans(int x,              //待计算的x坐标
                                 int y,             //待计算的y坐标
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
        int gapX, gapY;
        if (DirectionX.equals( "Left") && DirectionY.equals( "Top"))//分4种情况计算，每种情况计算形式
        {
            //#region
            if (SetCoorX.equals("Left") && SetCoorY.equals( "Top"))//分4种情况计算，每种情况计算形式
            {
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)//分4种情况计算，每种情况计算形式相同
                {
                    gapX = SetCoorDieX - x;     //参考点坐标与待计算坐标的偏差
                    gapY = SetCoorDieY - y;      //参考点坐标与待计算坐标的偏差
                    TransferDieX = Convert2Letter(tx - gapX);//参考坐标的字母与偏差相加或想减，然后把结果转换成字母，即为计算结果。
                    TransferDieY = Convert2Letter(ty - gapY);//参考坐标的字母与偏差相加或想减，然后把结果转换成字母，即为计算结果。
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)  //以下计算形式同上，计算剩下63种可能性。
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }

                else    if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {
                    gapX =  Math.abs(SetCoorDieX - x);
                    gapY =  Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {
                    gapX =  Math.abs(SetCoorDieX - x);
                    gapY =  Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
            //#endregion
            //#region
            else if (SetCoorX.equals("Left") && SetCoorY.equals("Down"))
            {
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)
                {
                    gapX = SetCoorDieX - x;
                    gapY = SetCoorDieY - y;
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else    if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)
                {
                    gapX =  Math.abs(SetCoorDieX - x);
                    gapY =  Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }

                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {
                    gapX =  Math.abs(SetCoorDieX - x);
                    gapY =  Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
            // #endregion
            //#region
            else  if (SetCoorX.equals("Right")&& SetCoorY.equals("Top"))
            {
            	System.out.println("jinlaile ~~~");
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)
                {System.out.println(1);
                    gapX = SetCoorDieX - x;
                    gapY = SetCoorDieY - y;
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else    if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)
                {System.out.println(2);
                    gapX =  Math.abs(SetCoorDieX - x);
                    gapY =  Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }

                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {System.out.println(3);
                    gapX =  Math.abs(SetCoorDieX - x);
                    gapY =  Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else    if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {System.out.println(4);
                    gapX =  Math.abs(SetCoorDieX - x);
                    gapY =  Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
           // #endregion
            //#region
            else if (SetCoorX.equals("Right") && SetCoorY.equals("Down"))
            {
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)
                {
                    gapX = SetCoorDieX - x;
                    gapY = SetCoorDieY - y;
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)
                {
                    gapX =  Math.abs(SetCoorDieX - x);
                    gapY =  Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }

                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
           // #endregion
        }
        else  if (DirectionX.equals("Left") && DirectionY.equals("Down"))
        {
           // #region
            if (SetCoorX.equals("Left") && SetCoorY.equals("Top"))
            {
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)
                {
                    gapX = SetCoorDieX - x;
                    gapY = SetCoorDieY - y;
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else    if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }

                else    if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else      if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
            //#endregion
           // #region
            else if (SetCoorX.equals("Left") && SetCoorY.equals("Down"))
            {
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)
                {
                    gapX = SetCoorDieX - x;
                    gapY = SetCoorDieY - y;
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }

                else    if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                
                else    if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
            //#endregion
           // #region
            else  if (SetCoorX.equals("Right") && SetCoorY.equals("Top"))
            {
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)
                {
                    gapX = SetCoorDieX - x;
                    gapY = SetCoorDieY - y;
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieX+"/"+TransferDieY;
                    return DieXandDieY;
                }

                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
           // #endregion
           // #region
            else   if (SetCoorX.equals("Right") && SetCoorY.equals("Down"))
            {
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)
                {
                    gapX = SetCoorDieX - x;
                    gapY = SetCoorDieY - y;
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }

                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
            //#endregion
        }
        else  if (DirectionX.equals("Right") && DirectionY.equals( "Top"))
        {
           // #region
            if (SetCoorX.equals("Left") && SetCoorY.equals("Top"))
            {
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)
                {
                    gapX = SetCoorDieX - x;
                    gapY = SetCoorDieY - y;
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }

                else  if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else  if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
           // #endregion
            //#region
            else  if (SetCoorX.equals("Left") && SetCoorY.equals("Down"))
            {
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)
                {
                    gapX = SetCoorDieX - x;
                    gapY = SetCoorDieY - y;
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else    if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }

                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
            //#endregion
            //#region
            else if (SetCoorX.equals("Right") && SetCoorY.equals("Top"))
            {
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)
                {
                    gapX = SetCoorDieX - x;
                    gapY = SetCoorDieY - y;
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }

                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
            //#endregion
           // #region
            else if (SetCoorX.equals("Right") && SetCoorY.equals("Down"))
            {
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)
                {
                    gapX = SetCoorDieX - x;
                    gapY = SetCoorDieY - y;
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)
                {
                
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }

                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else    if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
            //#endregion
        }

        else  if (DirectionX.equals("Right") && DirectionY.equals("Down"))
        {
            //#region
            if (SetCoorX.equals("Left") && SetCoorY.equals("Top"))
            {
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)
                {
                    gapX = SetCoorDieX - x;
                    gapY = SetCoorDieY - y;
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else  if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }

                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else  if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
            //#endregion
            //#region
            else  if (SetCoorX.equals("Left") && SetCoorY.equals("Down"))
            {
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)
                {
                    gapX = SetCoorDieX - x;
                    gapY = SetCoorDieY - y;
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else  if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }

                else  if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieX+"/"+TransferDieY;
                    return DieXandDieY;
                }
                else    if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
            //#endregion
            //#region
            else if (SetCoorX.equals("Right") && SetCoorY.equals("Top"))
            {
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)
                {
                    gapX = SetCoorDieX - x;
                    gapY = SetCoorDieY - y;
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else    if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }

                else  if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else   if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
           // #endregion
           // #region
            else   if (SetCoorX.equals("Right") && SetCoorY.equals("Down"))
            {
                if (SetCoorDieX - x >= 0 && SetCoorDieY - y >= 0)
                {
                    gapX = SetCoorDieX - x;
                    gapY = SetCoorDieY - y;
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else if (SetCoorDieX - x >= 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx - gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }

                else  if (SetCoorDieX - x < 0 && SetCoorDieY - y >= 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty - gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
                else if (SetCoorDieX - x < 0 && SetCoorDieY - y < 0)
                {
                    gapX = Math.abs(SetCoorDieX - x);
                    gapY = Math.abs(SetCoorDieY - y);
                    TransferDieX = Convert2Letter(tx + gapX);
                    TransferDieY = Convert2Letter(ty + gapY);
                    DieXandDieY=TransferDieY+"/"+TransferDieX;
                    return DieXandDieY;
                }
            }
            //#endregion
        }
//        System.out.println("那种都不是！");
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
	     
		  public static void main(String[] args)
		  {
			  IndexChange ic=new IndexChange();
			  int i;
			  i=ic.ColumnToIndex("AAAA");
			  System.out.println("i    "+i);  
			  String column=null;
			  column=ic.Convert2Letter(5);
			 // System.out.println(column);
			  //好奇怪这个 横纵坐标换了 才能得到想要的。
//			  DieXandDieY=DiePositionTrans(-2,2, "Right", "Top", "Right", "Down", 0, 1, "AAAA", "AAAA");
//			  System.out.println(DieXandDieY);
			  
		  }
}
