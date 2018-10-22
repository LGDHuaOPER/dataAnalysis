buildColorGradation({
	width: 600,
	height: 600,
	container: 'canvas_parameterMap',
	bgFillColor: "#eee",
	waferData: futuredGlobal.S_getMockWaferData()[0],
	spacePercent: {
		x: 0.13,
		y: 0.13
	},
	m_DieDataListNew: futuredGlobal.S_getMockWaferData()[0].waferMapDataList[0].m_DieDataListNew,
	colorGradation: {
		limitColor: "#FF0000",
		floorColor: "#0000FF",
		nums: 256
	}
});