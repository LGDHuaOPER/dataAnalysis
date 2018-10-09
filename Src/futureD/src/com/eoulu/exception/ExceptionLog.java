package com.eoulu.exception;

public class ExceptionLog {
	public static void printException(Exception e){
		StackTraceElement[] stackTraceElements = e.getStackTrace();
        String result = e.toString() + "\n";
       for (int index = 0; index< stackTraceElements.length - 1; ++index) {
               result += "at [" + stackTraceElements[index].getClassName() + ",";
               result+= stackTraceElements[index].getFileName() + ",";
                result += stackTraceElements[index].getMethodName() + ",";
               result += stackTraceElements[index].getLineNumber() + "]\n";
        }
       System.out.println(result);
	}
}
