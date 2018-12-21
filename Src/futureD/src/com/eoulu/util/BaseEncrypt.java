/**
 * 
 */
package com.eoulu.util;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import com.sun.org.apache.xml.internal.security.exceptions.Base64DecodingException;
import com.sun.org.apache.xml.internal.security.utils.Base64;



/**
 * @author mengdi
 *
 * 
 */
public class BaseEncrypt {

	
	public static String decode(String data){
		byte[] decode = null;
		try {
			decode = Base64.decode(data);
		} catch (Base64DecodingException e) {
			e.printStackTrace();
		}
		return new String(decode);
	}
	/**
	 * 加密
	 * @param sSrc
	 * @param sKey
	 * @return
	 * @throws Exception
	 */
    public static String Encrypt(String sSrc, String sKey) throws Exception {
        if (sKey == null) {
            System.out.print("Key为空null");
            return null;
        }
        // 判断Key是否为16位
        if (sKey.length() != 16) {
            System.out.print("Key长度不是16位");
            return null;
        }
        byte[] raw = sKey.getBytes("utf-8");
        SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");//"算法/模式/补码方式"
        cipher.init(Cipher.ENCRYPT_MODE, skeySpec);
        byte[] encrypted = cipher.doFinal(sSrc.getBytes("utf-8"));

        return Base64.encode(encrypted);//此处使用BASE64做转码功能，同时能起到2次加密的作用。
    }

    /**
     * 解密
     * @param sSrc
     * @param sKey
     * @return
     * @throws Exception
     */
    public static String Decrypt(String sSrc, String sKey) throws Exception {
        try {
            // 判断Key是否正确
            if (sKey == null) {
                System.out.print("Key为空null");
                return null;
            }
            // 判断Key是否为16位
            if (sKey.length() != 16) {
                System.out.print("Key长度不是16位");
                return null;
            }
            byte[] raw = sKey.getBytes("utf-8");
            SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, skeySpec);
            byte[] encrypted1 =  Base64.decode(sSrc);//先用base64解密
            try {
                byte[] original = cipher.doFinal(encrypted1);
                String originalString = new String(original,"utf-8");
                return originalString;
            } catch (Exception e) {
                System.out.println(e.toString());
                return null;
            }
        } catch (Exception ex) {
            System.out.println(ex.toString());
            return null;
        }
    }

    public static void main(String[] args) throws Exception {
        /*
         * 此处使用AES-128-ECB加密模式，key需要为16位。
         */
        String cKey = "1234567890123456";
        // 需要加密的字串
        String cSrc = "123456";
        System.out.println(cSrc);
        // 加密
        String enString = BaseEncrypt.Encrypt("jdbc:mysql://localhost:3306/futured_v2?useUnicode=true&characterEncoding=utf-8", cKey);
        System.out.println("加密后的字串是：" + enString);
        String user = BaseEncrypt.Encrypt("admin", cKey);
        System.out.println("加密后的字串是：" + user);
        String password = BaseEncrypt.Encrypt("eoulu2015", cKey);
        System.out.println("加密后的字串是：" + password);

        // 解密
//        String DeString = BaseEncrypt.Decrypt("pfxSphs3qHtr+PA34DmPwRFC2eQeBPRc8i8xLhyH6qCKd6RngknEv/M2Wld1hIAN8r0SdLwsdJRhp/33z3eU4cRhk2E0oumNf08S8mlPkTs=", cKey);
//        System.out.println("解密后的字串是：" + DeString);
//        String decode = BaseEncrypt.Decrypt("3jgmUpRuHqoLmF418AV7Sw==",cKey);
//		System.out.println("解密后的数据为："+decode);
//		String pwd = BaseEncrypt.Decrypt("3jgmUpRuHqoLmF418AV7Sw==", cKey);
//		System.out.println("解密后的数据为："+pwd);
    }
	
	
}
