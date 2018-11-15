/**
 * 
 */
package com.eoulu.test;

/**
 * @author mengdi
 *
 * 
 */
public class TestNew {
	
	private String str;
//	static{
//		 ab = new TestNew();
//		System.out.println("执行");
//	}
	
	private static class TestNewSingle{
		private static int a = 9;
		private static final TestNew ab = new TestNew();
		static{
			System.out.println("几次");
		}
	}
	
	public static TestNew getSingle(){
		return TestNewSingle.ab;
	}
	
	public static int getA(){
		return TestNewSingle.a;
	}
	
	public TestNew(){
		System.out.println("创建对象");
	}
	
	public void getMessage(String str){
		this.str = str;
		System.out.println("sehzhi");
	}
	
	public String getMessage(){
		System.out.println("get");
		return str;
	}

	
	public static void main(String[] args) {
//		TestNew a = new TestNew().getSingle();
		TestNew.getSingle().getMessage("hahah");
		System.out.println(TestNew.getSingle());
//		TestNew d = new TestNew().getSingle();
		TestNew.getSingle().getMessage("hahah");


//		TestNew c = new TestNew().ab;
//		c.getMessage("hahah");
//		
//		TestNew b = new TestNew().ab;
//		System.out.println(b.getMessage());
	}
}
