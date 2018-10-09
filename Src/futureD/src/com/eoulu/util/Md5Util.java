package com.eoulu.util;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
/**
 * 
 * @author mengdi
 *
 *
 */
public class Md5Util {
	public static String md5(String data){
		StringBuffer buf = new StringBuffer("");
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(data.getBytes());
			byte b[] = md.digest();
			int i;
			for (int offset = 0; offset < b.length; offset++) {
			i = b[offset];
			if (i < 0)
			i += 256;
			if (i < 16)
			buf.append("0");
			buf.append(Integer.toHexString(i));
			}
			
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		return buf.toString();
	}
	public static void main(String[] args) {
		System.out.println(Md5Util.md5("admin"));
	}
}
