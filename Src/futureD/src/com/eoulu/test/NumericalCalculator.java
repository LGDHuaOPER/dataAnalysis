/**
 * 
 */
package com.eoulu.test;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

/**
 * @author mengdi
 *
 * 
 */
public class NumericalCalculator {

	//操作数栈
	   /* private Stack<EmOperator> opStack = new Stack<EmOperator>();
	    //数据栈
	    private Stack<BigDecimal> dataStack = new Stack<BigDecimal>();*/
	    //负号替代符
	    private static final char NEGATIVE_SIGN = '#';
	    //小数点
	    private static final char RADIX_POINT = '.';
	    //表达式占位符
	    private static final char EXPRESSION_PLACEHOLDER = '$';
	 
	 
	    public static double cal(String expression, double... values) throws ExpressionFormatException{
	        expression = preProcess(expression, values);
	        //操作数栈
	        Stack<EmOperator> opStack = new Stack<EmOperator>();
	        //数据栈
	        Stack<BigDecimal> dataStack = new Stack<BigDecimal>();
	        return _cal(expression, opStack, dataStack);
	    }
	 
	    /**计算主逻辑*/
	    private static double _cal(String expression, Stack<EmOperator> opStack, Stack<BigDecimal> dataStack) throws ExpressionFormatException{
	        StringBuilder strBuilder;
	        char[] charArr;int length;char value;EmOperator curOp;EmOperator stackOp;
	        length = (charArr = expression.toCharArray()).length ;
	        for (int i=0; i<length;) {
	            value = charArr[i];
	            strBuilder = new StringBuilder();
	 
	            //以负号(#)或者数字开头，那么将从这个index到之后的所有数字及小数点(.)字符拼接成一个数值。放入数据栈
	            if(Character.isDigit(value) || NEGATIVE_SIGN == value){
	                strBuilder.append(NEGATIVE_SIGN == value ? "-" : value);
	                char next;
	                while (++i < length) {
	                    if (!Character.isDigit(next = charArr[i]) && !(RADIX_POINT == next)) {
	                        break;
	                    }
	                    strBuilder.append(next);
	                }
	                try {
	                    dataStack.push(new BigDecimal(strBuilder.toString()));
	                } catch (Exception ex) {
	                    throw new ExpressionFormatException("数字格式不正确");
	                }
	 
	                //简单符号，+ - * / % ( ) 流程：
	                //如果操作数栈为空，或者目前操作数的优先级大于栈顶操作符，那么将这个操作符入栈。
	                //如果是右括号)，或者目前优先级 小于 栈顶操作符，那么出栈做计算
	            } else if(EmOperator.isSimpleOperator(String.valueOf(value))) {
	                if (!EmOperator.RIGHT_BRACKET.equals(curOp = EmOperator.getByExpression(String.valueOf(value)))
	                        && (opStack.isEmpty() || EmOperator.LEFT_BRACKET.equals(stackOp = opStack.peek()) || stackOp.getPriority() < curOp.getPriority())) {
	                    opStack.push(curOp);
	                    ++i;
	                } else {
	                    singleCal(opStack, dataStack);
	                    if (EmOperator.RIGHT_BRACKET.equals(curOp)) {
	                        //如果是右括号，则循环计算，直到碰到左括号
	                        while (!EmOperator.LEFT_BRACKET.equals(opStack.peek())) {
	                            singleCal(opStack, dataStack);
	                        }
	                        if (!EmOperator.LEFT_BRACKET.equals(opStack.pop())) {
	                            throw new ExpressionFormatException("解析异常");
	                        }
	                        ++i;
	                    }
	 
	                }
	 
	                //符号运算符流程，具体有哪些查看 EmOperator：
	                //1.如果第一个字符是字母，那么往后找到所有字母，直到左括号(所有的符号运算都是XX(3,4)或者XX(5)的结构)
	                //2.查找运算的参数，如pow(3+5,abs(-4))，那么参数为3+5和abs(-4)，分别计算子项，返回后在计算pow(8,4)
	                //3.将结果压入数据栈，供其他运算使用。
	            } else if (Character.isLetter(value)) {
	                while (i < length && Character.isLetter(charArr[i])) {
	                    strBuilder.append(charArr[i]);
	                    ++i;
	                }
	                curOp = EmOperator.getByExpression(strBuilder.toString().toLowerCase());
	                if (null == curOp) {
	                    throw new ExpressionFormatException("未知的操作符:" + strBuilder.toString());
	                }
	                if (charArr[i] != '(') throw new ExpressionFormatException("公式[" + curOp + "]格式不正确，缺少‘('");
	 
	                //匹配右括号，pow(3+5,abs(-4))为了防止匹配到-4后面的‘)’，遍历的时候要做左括号的记数
	                String temp = new String(charArr);
	                int count = 1;
	                int rightIndex = -1;
	                for (int j = i + 1; j<charArr.length; ++j) {
	                    if (charArr[j] == ')') {
	                        if (count == 1) {
	                            rightIndex = j;
	                            break;
	                        }
	                        --count;
	                    }
	                    if (charArr[j] == '(') ++count;
	                }
	                if (rightIndex < 0) throw new ExpressionFormatException("公式[" + curOp + "]格式不正确，缺少‘)'");
	 
	                temp = temp.substring(i + 1, rightIndex);
	                List<String> params = new ArrayList<String>();
	 
	                //pow(min(1 + 2, 3),-1 * abs(max(1,1/-4+1/4)))
	                int splitIndex = 0;
	                int existBracket = 0;//中间还有未匹配的括号个数
	                for (int j=0; j<temp.length(); ++j) {
	                    if (temp.charAt(j) == ',' && existBracket == 0) {
	                        params.add(temp.substring(splitIndex, j));
	                        splitIndex = j + 1;
	                    }
	                    if (temp.charAt(j) == '(') {
	                        ++existBracket;
	                    } else if (temp.charAt(j) == ')') {
	                        --existBracket;
	                    }
	                }
	                if (splitIndex < temp.length()) {
	                    params.add(temp.substring(splitIndex));
	                }
	                if (params.size() != curOp.getParamNumber()) throw new ExpressionFormatException("公式，参数个数不正确:[运算符号:" + curOp + "][需要参数个数:" + curOp.getParamNumber() + "][入参:" + expression + "]");
	                for (String param : params) {
	                    dataStack.push(new BigDecimal(new NumericalCalculator().cal(param)));
	                }
	                if (opStack.isEmpty() || opStack.peek().getPriority() < curOp.getPriority()) {
	                    opStack.push(curOp);
	                } else {
	                    singleCal(opStack, dataStack);
	                }
	                i = rightIndex + 1;
	            } else {
	                throw new ExpressionFormatException("未知字符:" + String.valueOf(value));
	            }
	        }
	        while (!opStack.isEmpty()) {
	            singleCal(opStack, dataStack);
	        }
	        return dataStack.pop().setScale(4, RoundingMode.HALF_UP).doubleValue();
	    }
	 
	    /**在运算符栈取出一个运算符，根据运算符需要参数的个数，在数据栈取参数，将计算结果放入数据栈*/
	    private static void singleCal(Stack<EmOperator> opStack, Stack<BigDecimal> dataStack) throws ExpressionFormatException{
	        EmOperator op = opStack.peek();
	        if (EmOperator.LEFT_BRACKET.equals(op)) {
	            return ;
	        }
	        opStack.pop();
	        //!!!!!!!重点:所有的数值计算最后都可以拆解为二元的运算，或者一元的运算
	        BigDecimal firstValue;
	        BigDecimal secondValue = null;
	        if (op.getParamNumber() == 1) {
	            firstValue = dataStack.pop();
	        } else {
	            secondValue = dataStack.pop();
	            firstValue = dataStack.pop();
	        }
	        double result;
	        switch (op){
	            case ADD:result = firstValue.add(secondValue).doubleValue(); break;
	            case SUB:result = firstValue.subtract(secondValue).doubleValue(); break;
	            case MULTIPLY:result = firstValue.multiply(secondValue).doubleValue(); break;
	            case DIVIDE:result = firstValue.divide(secondValue, 4, RoundingMode.HALF_UP).doubleValue(); break;
	            case MOD: result = firstValue.doubleValue() % secondValue.doubleValue(); break;
	            case POW:result = Math.pow(firstValue.doubleValue(), secondValue.doubleValue()); break;
	            case SQRT:
	                if (firstValue.doubleValue() < 0) throw new ExpressionFormatException("SQRT公式参数小于零:" + firstValue);
	                result = Math.sqrt(firstValue.doubleValue());
	                break;
	            case ABS:result = Math.abs(firstValue.doubleValue()); break;
	            case MAX: result = Math.max(firstValue.doubleValue(), secondValue.doubleValue());  break;
	            case EXP: result = Math.exp(firstValue.doubleValue()); break;
	            case LOG: result = Math.log(firstValue.doubleValue()); break;
	            case MIN: result = Math.min(firstValue.doubleValue(), secondValue.doubleValue()); break;
	            case CEIL: result = Math.ceil(firstValue.doubleValue()); break;
	            case LOG10: result = Math.log10(firstValue.doubleValue()); break;
	            default:
	                throw new ExpressionFormatException("未实现的运算符[" + op + "]");
	        }
	        dataStack.push(new BigDecimal("" + result));
	        return;
	    }
	 
	    /**
	     * 字符串预处理
	     *
	     * @param expression
	     *
	     * @return
	     */
	    private static String preProcess(String expression, double... values) throws ExpressionFormatException{
	        expression = expression.replaceAll("\\s", "").replaceAll("（", "(")
	                .replaceAll("）", ")").replaceAll("，", ",").toLowerCase();
	 
	        //将表达式中的占位符，替换为数值。
	        if (values.length > 0) {
	            int paramIndex = 0;
	            int $Index = 0;
	            while($Index < expression.length()) {
	                $Index = expression.indexOf(EXPRESSION_PLACEHOLDER);
	                if ($Index < 0) break;
	                expression = expression.substring(0, $Index) + new BigDecimal(String.valueOf(values[paramIndex])) + expression.substring($Index + 1);
	                ++paramIndex;
	            }
	        }
	 
	        //遍历替换表达式中负号改为#
	        char[] arr = expression.toCharArray();
	        for (int i = 0; i < arr.length; i++) {
	            if (arr[i] == '-') {
	                if (i == 0) {
	                    arr[i] = NEGATIVE_SIGN;
	                } else {
	                    char c = arr[i - 1];
	                    if (c == '+' || c == '-' || c == '*' || c == '/' || c == '(' || c == '%') {
	                        arr[i] = NEGATIVE_SIGN;
	                    }
	                }
	            }
	        }
	        //去除表达式头部的加号
	        if (arr[0] == '+') return new String(arr, 1, arr.length-1);
	        if (arr[0] == '*' || arr[0] == '/' || arr[0] == '%' || arr[arr.length-1] == '*'|| arr[arr.length-1] == '/'|| arr[arr.length-1] == '%')
	            throw new ExpressionFormatException("表达式格式不正确,不能以*,/,%开头或结尾");
	        //如果表达式以负号开头，那么在其前面加一个0->0-expression
	        if(arr[0]==NEGATIVE_SIGN && (arr[1]=='(' || Character.isDigit(arr[1]) || Character.isLetter(arr[1]))){
	            arr[0]='-';
	            return "0" + new String(arr);
	        }else{
	            return new String(arr);
	        }
	 
	    }
	 
	 
	    /**通过数组的方式，计算*/
	    public static List<BigDecimal> cal4Arr(String expression, List<BigDecimal>... params) throws ExpressionFormatException{
	        if (params.length < 1) throw new ExpressionFormatException("参数数目不正确[" + expression + "][params=" + params + "]");
	        int paramLen = params[0].size();
	        for (List<BigDecimal> valueList : params) {
	            if (paramLen != valueList.size()) throw new ExpressionFormatException("参数列表长度不相等[" + expression + "][params=" + params + "]");
	        }
	        expression = preProcess(expression);
	        int paramsCount = 0;
	        char[] chars = expression.toCharArray();
	        for (char c : chars) {
	            paramsCount += c == EXPRESSION_PLACEHOLDER ? 1 : 0;
	        }
	        if (paramsCount != params.length) throw new ExpressionFormatException("参数数目不正确[" + expression + "][params=" + params + "]");
	        List<BigDecimal> resultList = new ArrayList<BigDecimal>();
	        for (int i=0; i< paramLen; ++i) {
	            double[] singleParams = new double[params.length];
	            for (int j=0; j<params.length; ++j) {
	                singleParams[j] = params[j].get(i).doubleValue();
	            }
	            resultList.add(new BigDecimal("" + cal(expression, singleParams)).setScale(4, RoundingMode.HALF_UP));
	        }
	        return resultList;
	    }

	
}
