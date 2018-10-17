package com.eoulu.transfer;

import java.util.Hashtable;
/**
 * 单例模式
 * @author mengdi
 *
 * 进度条存储
 */
public class ProgressSingleton {
	
	private static Hashtable<Object, Object> table = new Hashtable<>();
	
	
	public static void put(Object key,Object value){
		table.put(key, value);
	}
	
	public static Object get(Object key){
		return table.get(key);
	}
	
	public static Object remove(Object key){
		return table.remove(key);
	}

	
	public static void main(String[] args) {
		Hashtable<Object, Object> table = new Hashtable<>();
		table.put("1", "werw");
		table.put("1", "345");
		System.out.println(table);
	}
}
