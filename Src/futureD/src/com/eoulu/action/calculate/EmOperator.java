/**
 * 
 */
package com.eoulu.action.calculate;

/**
 * @author mengdi
 *
 * 
 */
public enum EmOperator {

	
	ADD("+", 2, 1,"加法"),
    SUB("-", 2, 1, "减法"),
    MULTIPLY("*", 2, 2, "乘法"),
    DIVIDE("/", 2, 2, "除法"),
    POW("pow", 2, 3, "幂函数"),
    FACTORIAL("factorial",1,3,"阶乘"),
    SQRT("sqrt", 1, 3, "平方根"),
    LN("ln",1,3,"e为底的对数"),
    LOGT("logt", 1, 3, "10为底的对数"),
    SIN("sin",1,3,"正弦函数"),
    COS("cos",1,3,"余弦函数"),
    TAN("tan",1,3,"正切函数"),
    LEFT_BRACKET("(", 0, Integer.MAX_VALUE, "左括号"),
    RIGHT_BRACKET(")", 0, Integer.MAX_VALUE, "右括号"),
    EXP("e", 1, 3, "指数函数"),
//    PI("π", 0, 3, "π"),
    ABS("abs", 1, 3, "绝对值"),
    MOD("%", 2, 2, "取模"),
    LOG("log", 1, 3, "自然对数"),
    CEIL("ceil", 1, 3, "常用对数"),
    MAX("max", 2, 3, "最大值"),
    MIN("min", 2, 3, "最小值")
   
    ;

	
	//表达式，目前还没用，可使用反射调用某个对象的expression方法，需要加参数类型数组字段。
    private String expression;
    //运算符参数个数
    private int paramNumber;
    //运算符优先级
    private int priority;
    //描述
    private String desc;
    EmOperator(String expression, int paramNumber,int priority,  String desc) {
        this.expression = expression;
        this.paramNumber = paramNumber;
        this.priority = priority;
        this.desc = desc;
    }
    public static boolean isSimpleOperator(String expression) {
        return ADD.expression.equals(expression) || SUB.expression.equals(expression)
                || LEFT_BRACKET.expression.equals(expression) || RIGHT_BRACKET.expression.equals(expression)
                || MULTIPLY.expression.equals(expression) || DIVIDE.expression.equals(expression)
                || MOD.expression.equals(expression);
    }
    public static EmOperator getByExpression(String expression) {
        for (EmOperator operator : EmOperator.values()) {
            if (operator.expression.equals(expression)) {
                return operator;
            }
        }
        return null;
    }
 
    public String getExpression() {
        return expression;
    }
 
    public void setExpression(String expression) {
        this.expression = expression;
    }
 
    public int getParamNumber() {
        return paramNumber;
    }
 
    public void setParamNumber(int paramNumber) {
        this.paramNumber = paramNumber;
    }
 
    public int getPriority() {
        return priority;
    }
 
    public void setPriority(int priority) {
        this.priority = priority;
    }
 
    public String getDesc() {
        return desc;
    }
 
    public void setDesc(String desc) {
        this.desc = desc;
    }

	
}
