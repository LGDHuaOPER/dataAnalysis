package com.eoulu.action.version;

import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;

import org.tmatesoft.svn.core.SVNDirEntry;
import org.tmatesoft.svn.core.SVNException;
import org.tmatesoft.svn.core.SVNNodeKind;
import org.tmatesoft.svn.core.SVNURL;
import org.tmatesoft.svn.core.auth.ISVNAuthenticationManager;
import org.tmatesoft.svn.core.internal.io.dav.DAVRepositoryFactory;
import org.tmatesoft.svn.core.io.SVNRepository;
import org.tmatesoft.svn.core.io.SVNRepositoryFactory;
import org.tmatesoft.svn.core.wc.SVNWCUtil;

public class SVNUtil {

	  private static HashMap<String, String> map = new HashMap<>();
	    public static HashMap<String, String> listFiles(){
	    	 DAVRepositoryFactory.setup();
	         /*
	          * 相关变量赋值
	          */
	         String url = "https://win-filesvr1:8443/svn/cfChicken/team1/cfChicken1/cfChicken1";
	         String name = "mengdi";
	         String password = "0000";
	         //定义svn版本库的URL。
	         SVNURL repositoryURL = null;
	         //定义版本库。
	         SVNRepository repository = null;
	         /*
	          * 实例化版本库类
	          * */
	         try {
	         	//获取SVN的URL。
	         	repositoryURL=SVNURL.parseURIEncoded(url);
	         	//根据URL实例化SVN版本库。
	             repository = SVNRepositoryFactory.create(repositoryURL);
	         } catch (SVNException svne) {
	             /*
	              * 打印版本库实例创建失败的异常。
	              */
	             System.err
	                     .println("创建版本库实例时失败，版本库的URL是 '"
	                             + url + "': " + svne.getMessage());
//	             System.exit(1);
	         }
	  
	         /*
	          * 对版本库设置认证信息。
	          */
	         ISVNAuthenticationManager authManager = SVNWCUtil.createDefaultAuthenticationManager(name, password);
	         repository.setAuthenticationManager(authManager);
	  System.out.println("1步");
	         /*
	          * 上面的代码基本上是固定的操作。
	          * 下面的部分根据任务不同，执行不同的操作。
	          * */
	         try {
	             //打印版本库的根
	             System.out.println("Repository Root: " + repository.getRepositoryRoot(true));
	             //打印出版本库的UUID
	             System.out.println("Repository UUID: " + repository.getRepositoryUUID(true));
	             System.out.println("");
	             //打印版本库的目录树结构
	             getJavaEntries(repository, "");
	         } catch (SVNException svne) {
	             System.err.println("打印版本树时发生错误: "
	                     + svne.getMessage());
//	             System.exit(1);
	         }
	         System.out.println("2步");
	         /*
	          * 获得版本库的最新版本树
	          */
	         long latestRevision = -1;
	         try {
	             latestRevision = repository.getLatestRevision();
	         } catch (SVNException svne) {
	             System.err
	                     .println("获取最新版本号时出错: "
	                             + svne.getMessage());
//	             System.exit(1);
	         }
//	         System.exit(0);
	         map.put("latestRevision", latestRevision+"");
	         System.out.println("TEST:"+map);
	         return map;
	    }
	    
	    public static void getJavaEntries(SVNRepository repository, String path) {
	    	System.out.println("path:"+path);
	    	 SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	        //获取版本库的path目录下的所有条目。参数－1表示是最新版本。
	        Collection entries;
			try {
				entries = repository.getDir(path, -1, null,(Collection) null);
				  Iterator iterator = entries.iterator();
			        while (iterator.hasNext()) {
			            SVNDirEntry entry = (SVNDirEntry) iterator.next();
//			            System.out.println("/" + (path.equals("") ? "" : path + "/")
//			                    + entry.getName() + " (author: '" + entry.getAuthor()
//			                    + "'; revision: " + entry.getRevision() + "; date: " + entry.getDate() + ")");
			            if(path.startsWith("src") && entry.getName().endsWith(".java")){
			            	map.put(entry.getName(), df.format(entry.getDate()));
			            }
			            /*
			             * 检查此条目是否为目录，如果为目录递归执行
			             */
			            if (entry.getKind() == SVNNodeKind.DIR) {
			            	getJavaEntries(repository, (path.equals("")) ? entry.getName()
			                        : path + "/" + entry.getName());
			            }
			        }
			} catch (SVNException e) {
				e.printStackTrace();
			}
	      
	    }
	
}
