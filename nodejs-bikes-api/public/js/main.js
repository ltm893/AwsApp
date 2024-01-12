//const res = require("express/lib/response");

const getBikeTableDetails = async () => {
   fetch('http://localhost:8080/api/getBikeTableDetails')
      .then((response) => {
         if (response.ok) {
            return response.json()
         }
      })
      .then((responseJson) => {
         loadBikeSelect(responseJson);
         if(!setupSearchButton(responseJson)) {
            alert("Search Button Issue") ; 
         }
         showFilteredAllSearch();
      })
      .catch((error) => {
         console.log(error)
         alert("Can not get Details from Database");
      });

}

const showFilteredAllSearch = () => {
   const radios = document.querySelectorAll('input[type=radio][name="queryType"]');
   radios.forEach(radio => radio.addEventListener('change', (event) => {
      let queryType = event.target.value
      if (queryType === 'filtered') {
         document.getElementById('querySelectorFiltered').style.display = 'block';
      } else if (queryType === 'all') {
         document.getElementById('querySelectorFiltered').style.display = 'none';
      }
      else {
         // alert("Can't detemine Query type")
      }
   }))
}

const getQueryType = () => {
   let val;
   if (document.querySelector('input[type=radio][name="queryType"]:checked')) {
      document.querySelectorAll('input[type=radio][name="queryType"]:checked').forEach((elem) => {
         val = elem.value;
      });
   }
   return val;
}

const loadBikeSelect = (data) => {
   tableSelectorElement = document.getElementById('bikeTableSelectorId');
   tableArray = Object.keys(data);
   var options = "";
   tableArray.map((op) => {
      options += `<option value="${op}" >${op}</option>`;
   })
   tableSelectorElement.innerHTML = options;
   loadFilterSelect(data);
}

const loadFilterSelect = (data) => {
   const tableSelectorElement = document.getElementById('bikeTableSelectorId');
   const table = tableSelectorElement.value;
   document.getElementById('bikeFilterSelectorId').innerHTML = getFilterOptionsArray(table, data);
   loadInsertInput(data[table]['fk']);
   tableSelectorElement.addEventListener('change', () => {
      const tableSelectorElement = document.getElementById('bikeTableSelectorId');
      const table = tableSelectorElement.value;
      document.getElementById('bikeFilterSelectorId').innerHTML = getFilterOptionsArray(table, data);
      loadInsertInput(data[table]['fk']);
   })
}

const loadInsertInput = async (fk) => {
   //console.log(fk)
   tableSelectorElement = document.getElementById('bikeTableSelectorId');
   const table = tableSelectorElement.value;
   attributeSeletorElement = document.getElementById('bikeFilterSelectorId');
   const vals = attributeSeletorElement.value;
   const attributes = [...attributeSeletorElement.options].map(o => o.text);
   const form = document.createElement("form");
   form.setAttribute("method", "post");
   form.setAttribute("action", "/api/addObject");
   let wrapperUl = document.createElement("ul");
   wrapperUl.setAttribute("class", "wrapper");
   form.appendChild(wrapperUl)

   for (const attr of attributes) {
      if (attr !== "id") {
         if (!fk.includes(attr)) {
            let inputName = attr + 'Input';
            inputName = document.createElement("input");
            inputName.setAttribute("type", "text");
            inputName.setAttribute("name", attr);
            let inputId = attr + 'InputId';
            inputName.setAttribute("id", inputId);
            let label = document.createElement("Label");
            label.setAttribute("for", inputId);
            label.innerHTML = attr;
            let rowLi = document.createElement("li");
            rowLi.setAttribute("class", "form-row");
            rowLi.appendChild(label);
            rowLi.appendChild(inputName)
            form.append(rowLi)
         }
         if (fk.includes(attr)) {
            const url = makeUrlForFk(table, attr);
            const idNameForFk = await fetch(url);
            if (idNameForFk) {
               const pks = await idNameForFk.json();
               const selectBoxId = attr + "SelectId"
               let rowLi = document.createElement("li");
               rowLi.setAttribute("class", "form-row");
               selectBox = document.createElement("select");
               selectBox.id = selectBoxId;
               let selectLabel = document.createElement("Label");
               selectLabel.setAttribute("for", selectBoxId);
               selectLabel.innerHTML = attr;
               rowLi.appendChild(selectLabel)
               rowLi.appendChild(selectBox);
               selectBox.innerHTML = makeSelectFks(pks);
               form.append(rowLi)
            }
         }
         // form.appendChild(label);
         // form.appendChild(inputName);
      }
   }
   rowBtn = document.createElement("li");
   rowBtn.setAttribute("class", "form-row");
   form.append(rowBtn)
   var submitBtn = document.createElement("input");
   submitBtn.setAttribute("type", "submit");
   submitBtn.setAttribute("value", "Submit");
   form.appendChild(submitBtn);
   insertElementDiv = document.getElementById("insertObjectId");
   insertElementDiv.innerHTML = "";
   insertElementDiv.appendChild(form);
}

const makeSelectFks = (idNames) => {
   let options = "";
   idNames.map((op) => {
      opValText = op.id + "-" + op.name;
      options += `<option value="${opValText}" >${opValText}</option>`;
   })
   return options;
}

const makeUrlForFk = (table, attr) => {
   let fTable;
   console.log(attr)
   switch (table) {
      case 'bikes':
         if (attr === 'brandId') {
            fTable = 'brands';
         }
         else if (attr === 'categoryId') {
            fTable = 'categories';
         }
         break;
      case 'orderitems':
         if (attr === 'orderId') {
            fTable = 'orders';
         }
         else if (attr === 'bikeId') {
            fTable = 'bikes';
         }
         break;
      case 'orders':
         if (attr === 'customerId') {
            fTable = 'customers';
         }
         else if (attr === 'storeId') {
            fTable = 'stores';
         }
         else if (attr === 'bikeId') {
            fTable = 'bikes';
         }
         else if (attr === 'staffId') {
            fTable = 'staffs';
         }
         break;
      case 'stocks':
         if (attr === 'bikeId') {
            fTable = 'bikes';
         }
         else if (attr === 'storeId') {
            fTable = 'stores';
         }
         break;

   }
   let queryObj = {};
   queryObj['table'] = fTable;
   const url = 'http://localhost:8080/api/getIdNameSelect?';
   const param = new URLSearchParams(queryObj).toString();
   return (url + param);
}

const getFilterOptionsArray = (tableSelected, data) => {
   let attrList = [];
   let attrArray = [];
   attrList = data[tableSelected]['attrs'];
   //attrFk = data[tableSelected]['fk'];
   attrList.forEach(ele => attrArray.push(ele));
   //console.log(attrArray)
   const removeAttrs = ["createdAt", "updatedAt"];
   const newAttrArray = attrList.filter(n => !removeAttrs.includes(n));
   //console.log(attrFk)
   var options = "";
   newAttrArray.map((op) => {
      options += `<option value="${op}" >${op}</option>`;
   })
   return options;
}

const getFilterByIdUrl = table => {
   const filterValue = document.getElementById('bikeFilterValue').value;
   let filterAttr = document.getElementById('bikeFilterSelectorId').value;
   let filterObj = {};
   filterObj[filterAttr] = filterValue;
   const preUrl = 'http://localhost:8080/api/';
   const postUrl = new URLSearchParams(filterObj).toString();
   let tableUrl;
   switch (table) {
      case 'bikes':
         tableUrl = 'getBikeById';
         break;
      case 'brands':
         tableUrl = 'getBrandById';
         break;
      case 'categories':
         tableUrl = 'getCategoryById';
         break;
      case 'customers':
         tableUrl = 'getCustomerById';
         break;
      case 'orderitems':
         tableUrl = 'getOrderitemsById';
         break;
      case 'orders':
         tableUrl = 'getOrderById';
         break;
      case 'staffs':
         tableUrl = 'getStaffById';
         break;
      case 'stocks':
         tableUrl = 'getStockById';
         break;
      case 'stores':
         tableUrl = 'getStoreById';
         break;
   }

   return (preUrl + tableUrl + '?' + postUrl);
}
const validateSearchParams = () => {
   queryType = getQueryType();
   if (queryType === undefined) {
      alert("Query Type Either Filtered or All is required");
      return false;
   }
   if (queryType === 'filtered') {
      if (!document.getElementById('bikeFilterValue').value) {
         alert("Filter Value Required for Filtered Search");
         document.getElementById('bikeFilterValue').focus();
         return false;
      }
   }
   return true;

}

const setupSearchButton = async (data) => {
   let queriedData;
   const bikeSearchButtonElement = document.getElementById('bike_search_button');
   bikeSearchButtonElement.addEventListener('click', async () => {
      if (validateSearchParams()) {
         let table = document.getElementById('bikeTableSelectorId').value;
         let url;
         let queryType = getQueryType();
         const attrHeaderArray = data[table];
         const tables = Object.keys(data);
         const filterAttr = document.getElementById('bikeFilterSelectorId').value;
         for (const t of tables) {
            if (t === table) {
               let Table = table.charAt(0).toUpperCase() + table.slice(1);
               if (queryType === 'all') {
                  url = 'http://localhost:8080/api/getAll' + Table;
                  let response, body;
                  try {
                     response = await fetch(url);
                     body = await response.json();
                     
                  }
                  catch (err) {
                     console.log(url + " Error");
                     console.log(err);
                     return false;
                  }
                  if (Object.keys(body).length > 0) {
                     displaySqlData(body, attrHeaderArray['attrs'], t);
                  }
                  else {
                     displayMessage("No rows in " + Table + " table");
                  }
                  
               }
               else if (queryType === 'filtered') {
                  if (filterAttr === 'id') {
                     url = getFilterByIdUrl(table);
                  }
                  response = await fetch(url);
                  let result;
                  result = await response.json();
                  if (result !== null) {
                     let data = []
                     data[0] = result
                     displaySqlData(data, attrHeaderArray, t);
                  }
                  else {
                     const filterId = document.getElementById('bikeFilterValue').value;
                     displayMessage("No rows in " + Table + " table for id " + filterId);
                  }
               }
            }
         }
      }
   })
}

const displayMessage = message => alert(message);

const displaySqlData = (data, attrHeaderArray, tableName) => {
   console.log  (data, attrHeaderArray, tableName)
   let tableHtml = `<table id="${tableName}" >`;
   tableHtml += '<tr>';
   for (const attr of attrHeaderArray) {
      tableHtml += `<th>${attr}</th>`;
   }
   tableHtml += '</tr>';
   for (const dr of data) {
      tableHtml += '<tr>';
      for (const attr of attrHeaderArray) {
         let abc = dr[attr];
         tableHtml += `<td>${abc}</td>`;
      }
      tableHtml += '</tr>';
   }
   tableHtml += '</table>';
   document.getElementById('displayData').innerHTML = tableHtml;
}

