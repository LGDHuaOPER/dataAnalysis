package com.eoulu.enums;

public enum SubdieFlagEnum {
	
	DIE("0"),
	SUBDIE("1");
	
	private String code;

	
	private SubdieFlagEnum(String code) {
		this.code = code;
	}


	public String getCode() {
		return code;
	}
	
	

}
