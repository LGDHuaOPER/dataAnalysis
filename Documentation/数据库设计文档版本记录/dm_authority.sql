/*
Navicat MySQL Data Transfer

Source Server         : Eoulu-work
Source Server Version : 50625
Source Host           : localhost:3306
Source Database       : futured_v2

Target Server Type    : MYSQL
Target Server Version : 50625
File Encoding         : 65001

Date: 2018-12-27 17:56:31
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for dm_authority
-- ----------------------------
DROP TABLE IF EXISTS `dm_authority`;
CREATE TABLE `dm_authority` (
  `authority_id` int(10) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `authority_name` char(100) NOT NULL COMMENT '权限名',
  `authority_url` char(100) NOT NULL,
  `page` char(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '页面',
  `hidden` int(10) NOT NULL,
  PRIMARY KEY (`authority_id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_authority
-- ----------------------------
INSERT INTO `dm_authority` VALUES ('7', '数据列表', 'DataList', '数据列表', '0');
INSERT INTO `dm_authority` VALUES ('8', '上传', 'UploadStorage', '数据列表', '0');
INSERT INTO `dm_authority` VALUES ('9', '修改', 'DataListUpdate', '数据列表', '0');
INSERT INTO `dm_authority` VALUES ('10', '删除', 'DataListRemove', '数据列表', '0');
INSERT INTO `dm_authority` VALUES ('11', '详细数据', 'WaferData', '详细数据', '0');
INSERT INTO `dm_authority` VALUES ('12', '回收站', 'RecycleBin', '回收站', '0');
INSERT INTO `dm_authority` VALUES ('13', '工程分析', 'ProjectAnalysis', '工程分析', '0');
INSERT INTO `dm_authority` VALUES ('14', '数据对比', 'DataCompare', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('15', 'RF-S2P分析', 'Analysis', '工程分析', '0');
INSERT INTO `dm_authority` VALUES ('16', '数据分析', 'DataStatistics', '工程分析', '0');
INSERT INTO `dm_authority` VALUES ('17', '管理员', 'UserInstall', '管理员', '0');
INSERT INTO `dm_authority` VALUES ('18', '上传文件', 'UploadFile', '数据列表', '1');
INSERT INTO `dm_authority` VALUES ('19', '上传进度', 'LoadProgress', '数据列表', '1');
INSERT INTO `dm_authority` VALUES ('20', '删除', 'RecycleBinRemove', '回收站', '0');
INSERT INTO `dm_authority` VALUES ('21', '恢复', 'RecycleBinRecovery', '回收站', '0');
INSERT INTO `dm_authority` VALUES ('22', '导出', 'ExportWafer', '详细数据', '0');
INSERT INTO `dm_authority` VALUES ('23', '矢量数据', 'VectorMap', '详细数据', '0');
INSERT INTO `dm_authority` VALUES ('24', '矢量数据过滤', 'VectorMapFilter', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('25', '矢量数据曲线', 'VectorCurve', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('26', 'Smith曲线切换', 'AnalysisCurve', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('27', '参数分布', 'WaferMap', '详细数据', '0');
INSERT INTO `dm_authority` VALUES ('28', '色阶晶圆', 'ColorMap', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('29', '良品率', 'ShowYield', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('30', '直方图', 'Histogram', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('31', '箱线图', 'Boxplot', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('32', 'CPK图', 'CPKServlet', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('33', '高斯分布', 'GaussianDistribution', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('34', '用户操作', 'UserOperate', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('35', '用户删除', 'UserRemove', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('36', '成员管理', 'UserManager', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('37', '密码修改', 'UserModifyPassword', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('38', '权限修改', 'AuthorityModify', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('39', '权限展示', 'Authority', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('40', '操作日志', 'LogInfo', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('41', '日志导出', 'LogExport', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('42', '共有参数', 'ParameterRange', '数据对比', '1');
INSERT INTO `dm_authority` VALUES ('43', '晶圆数据', 'DataListAjax', '数据对比', '1');
INSERT INTO `dm_authority` VALUES ('44', '良率晶圆', 'WaferMap', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('45', '色阶晶圆', 'ColorMap', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('46', '良品率', 'ShowYield', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('47', '直方图', 'Histogram', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('48', '箱线图', 'Boxplot', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('49', 'CPK图', 'CPKServlet', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('50', '相关性', 'Correlation', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('51', '用户查重', 'UserNameQuery', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('52', '检验是否能够绘图', 'Examine', '数据列表', '1');
INSERT INTO `dm_authority` VALUES ('53', '工程分析校验', 'ProjectVerification', '工程分析', '1');
INSERT INTO `dm_authority` VALUES ('54', 'RF-S2P曲线文件', 'AnalysisFile', 'RF-S2P', '1');
INSERT INTO `dm_authority` VALUES ('55', 'TCFMarker曲线', 'MarkerCurve', 'RF-S2P', '1');
INSERT INTO `dm_authority` VALUES ('56', 'TCF计算器新建修改参数', 'Calculator', 'RF-S2P', '1');
INSERT INTO `dm_authority` VALUES ('58', 'TCF当前晶圆所有参数结果公式', 'CalculationData', 'RF-S2P', '1');
INSERT INTO `dm_authority` VALUES ('59', 'TCF自定义参数是否存在', 'CustomParameter', 'RF-S2P', '1');
INSERT INTO `dm_authority` VALUES ('60', 'TCFMarker添加修改删除', 'MarkerOperate', 'RF-S2P', '1');
INSERT INTO `dm_authority` VALUES ('61', 'TCFMarker获取', 'GetMarker', 'RF-S2P', '1');
INSERT INTO `dm_authority` VALUES ('62', 'TCF应用到当前晶圆的其余die', 'MarkerSave', 'RF-S2P', '1');
INSERT INTO `dm_authority` VALUES ('63', '数据统计分析参数', 'WaferParameter', '数据统计', '1');
SET FOREIGN_KEY_CHECKS=1;
