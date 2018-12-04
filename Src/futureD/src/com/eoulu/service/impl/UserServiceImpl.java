/**
 * 
 */
package com.eoulu.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import com.eoulu.dao.user.AuthorityDao;
import com.eoulu.dao.user.RoleDao;
import com.eoulu.dao.user.UserDao;
import com.eoulu.entity.UserDO;
import com.eoulu.service.UserService;
import com.eoulu.transfer.PageDTO;

/**
 * @author mengdi
 *
 * 
 */
public class UserServiceImpl implements UserService{
	
	UserDao dao = new UserDao();
	AuthorityDao authorityDao = new AuthorityDao();
	

	@Override
	public String getPassword(String userName) {
		
		return dao.getPassword(userName);
	}

	@Override
	public List<Map<String, Object>> listUserByPage(PageDTO page, String keyword) {
		
		return dao.listUserInfo(page,keyword);
	}

	@Override
	public String saveUser(UserDO user) {
		String password = dao.getPassword(user.getUserName());
		if( password != null && !"".equals(password)){
			return "用户名不能重复！";
		}
		if("".equals(user.getPassword())){
			return "密码不能为空！";
		}
		return dao.insert(user)?"添加成功！":"添加失败！";
	}

	@Override
	public boolean updateUser(UserDO user) {
		return dao.update(user);
	}

	@Override
	public void updateLoginDate(String userName,String currentLogin) {
		String lastLogin = dao.getLastLogin(userName);
		if( "".equals(lastLogin) || dao.update(lastLogin, userName)){
			dao.updateLoginDate(currentLogin, userName);
		}
		
	}

	@Override
	public boolean remove(String userId) {
		return dao.delete(userId);
	}

	@Override
	public boolean updateAuthority(String authority, int userId) {
		return dao.updateUserAuthority(authority, userId);
	}


	@Override
	public List<String> getAuthority(String userName) {
		List<String> ls = new ArrayList<>();
		String reqName = "";
		String reqUrl = "",reqId="";
		reqUrl = dao.getUserAuthority(userName);
		List<Map<String,Object>> authorityPerPage = authorityDao.getAuthority(reqUrl);
		if(authorityPerPage == null){
			return null;
		}
		reqUrl = "";
		for(int j=0,size2=authorityPerPage.size();j<size2;j++){
			reqName += ","+authorityPerPage.get(j).get("authority_name").toString();
			reqId += ","+authorityPerPage.get(j).get("authority_id").toString();
			reqUrl += ","+authorityPerPage.get(j).get("authority_url").toString();
		}
		ls.add(reqName.length()>1?reqName.substring(1):"");
		ls.add(reqUrl.length()>1?reqUrl.substring(1):"");
		ls.add(reqId.length()>1?reqId.substring(1):"");
		return ls;
	}
	


	@Override
	public List<Map<String,Object>> getRole(String role) {
		RoleDao roleDao = new RoleDao();
		return roleDao.listRole();
	}

	@Override
	public int countUser(String keyword) {
		
		return dao.countUser( keyword);
	}

	@Override
	public Hashtable<String, Object> listAuthority(int userId) {
		Hashtable<String,Object> resultMap = new Hashtable<>();
		String roleName =  new RoleDao().getRoleName( userId);
		resultMap.put("roleName", roleName);
		resultMap.put("userAuthority", dao.getUserAuthority(userId));
		List<Map<String,Object>> page =  authorityDao.getAuthorityPage();
		Map<String,Object> map = null;
		String pageInfo = "";
		for(int i=0,size=page.size();i<size;i++){
			map = page.get(i);
			pageInfo = map.get("page").toString();
			List<Map<String,Object>> url = authorityDao.listAuthority(pageInfo);
			String reqUrl = "";
			String reqName = "";
			for(int j=0,size2=url.size();j<size2;j++){
				reqUrl += ","+url.get(j).get("authority_id").toString();
			}
			List<Map<String,Object>> authorityPerPage = authorityDao.getAuthority(reqUrl.substring(1));
			 reqUrl = "";
			for(int j=0,size2=authorityPerPage.size();j<size2;j++){
				reqName += ","+authorityPerPage.get(j).get("authority_name").toString();
				reqUrl += ","+authorityPerPage.get(j).get("authority_id").toString();
			}
			Map<String,Object> authorityMap = new HashMap<>();
			authorityMap.put("authorityName", reqName.substring(1));
			authorityMap.put("authority",reqUrl.substring(1));
			resultMap.put(pageInfo, authorityMap);
		}
	
		return resultMap;
	}

	@Override
	public List<Map<String, Object>> listRole() {
		return new RoleDao().listRole();
	}

	@Override
	public String getRoleName(int userId) {

		return new RoleDao().getRoleName(userId);
	}

	@Override
	public String getUserId(String userName) {
		return dao.getUserId(userName);
	}

	@Override
	public String getUserName(String userId) {
		
		String[] att = userId.split(",");
		String userName = dao.getUserName(Integer.parseInt(att[0]));
		for(int i=1,length=att.length;i<length;i++){
			userName += ","+dao.getUserName(Integer.parseInt(att[i]));
		}
		return userName;
	}

	@Override
	public boolean updatePassword(String password, String userName) {
		return dao.updatePassword(password, userName);
	}

	@Override
	public String getAuthorityId() {
		List<String> ls = authorityDao.getAuthorityId();
		String authority = "";
		for(int i=0,size=ls.size();i<size;i++){
			if(i == 0){
				authority += ls.get(i);
			}else{
				authority += ","+ls.get(i);
			}
			
		}
		return authority;
	}
	
	

}
