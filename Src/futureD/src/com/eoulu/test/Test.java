package com.eoulu.test;

public class Test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		IPSeeker ips = IPSeeker.getInstance();
		System.out.println(ips.getArea("180.107.214.11"));
		System.out.println(ips.getAddress("192.168.3.8"));
		System.out.println(ips.getCountry("119.248.161.65"));
	}
}
