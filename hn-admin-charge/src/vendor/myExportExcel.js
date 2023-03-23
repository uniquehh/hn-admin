// 根据传入的数据和键名处理数据
function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => {
      return v[j]
  }))
};
// header--你导出后表格的表头行 file_name--表格名字 data_key--表格数据的键(key) data--表格绑定的数据
function handleDownload(_header=[],_file_name="excel",_data_key=[],_data=[]){
  import('@/vendor/Export2Excel').then(excel => {
    const data = formatJson(_data_key, _data)
    excel.export_json_to_excel({
      header: _header,
      data,
      filename: _file_name,
      autoWidth: true,
      bookType: "xlsx"
    })
  })
};
export default handleDownload