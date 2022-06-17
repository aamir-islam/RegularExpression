const fs = require("fs");



let Data_collection = " ";

const Name = /\">[A-Za-z]{3,}\s[\s]?[A-Za-z]{3,}/g;
const Appointment_Status = /[A-Z]{9}/g;
const Appointment_Reference = /[A-Z]{2}\d{8}-\d{5}/g;
const Patient_Phone = /\(\d{3}\)\s\d{3}-\d{4}/g;
const Appointment_Tracking = />\s\d{5,}/g;
const Patient_Address =
  /(\w{1,}\s*\w{1,}\s\w{1,},\s)?(\w{1,}\s)?(\w{1,},\s)?(\w(1,)\s)?(\w{1,}\s)?(\w{1,}\s)?(\w{1,}\s\w{1,},\s)?\w{1,},\s*(\s*|\w{1,})\s\w{1,},\s\w{1,},.\d{5}/g;
  const Appointment_Date = /\d{2}\s\w{3}\s\d{4}\s\d{2}:\d{2}\s[A-Z]{2}/g;
const htmlData =
  /<tr>(\s*<td.{1,}\s*.{1,}\s*.{1,}\s*<td.{1,}\s*<td.{1,}\s*.{1,}\s*<td.{1,}\s*<td.{1,}\s*<td.{1,}\s*<td.{1,}\s*<td.{1,}\s*)\s*<\/tr>/g;



let Mobile_NumberArray = [];
let DateArray = [];
let AddressArray = [];
let StatusArray = [];
let AgentNameArray = [];
let TrackingArray = [];
let ReferenceArray = [];
let PatientNameArray = [];



fs.readFile("regex.html", "utf8", (error, data) => {
  if (error) {
    console.error(error);
    return;
  }
  const HTMT_TABLE_DATA = data.match(htmlData);
  
  HTMT_TABLE_DATA.map((item) => {
    let address = item.match(Patient_Address);
    let status = item.match(Appointment_Status);
    let reference = item.match(Appointment_Reference);
    let mobile = item.match(Patient_Phone);
    let tracking = item.match(Appointment_Tracking);
    let Name_Data = item.match(Name);
    let date = item.match(Appointment_Date);
    console.log(Name_Data)

    PatientNameArray.push(Name_Data[0].substring(2));

    if (Name_Data.length === 1) {
      AgentNameArray.push("N/A");
    } else {
      AgentNameArray.push(Name_Data[1].substring(2));
    }
    
    reference.map((ref) => {
      ReferenceArray.push(ref);
    });
    mobile.map((mob) => {
      Mobile_NumberArray.push(mob);

    });
    
    let Tracking_value = JSON.stringify(tracking);
    Tracking_value = Tracking_value.substring(4, Tracking_value.length - 4);

    if (Tracking_value === "null") {
      TrackingArray.push("n/a");
    } else {
      TrackingArray.push(Tracking_value);
    }
    status.map((Status) => StatusArray.push(Status));
    address.map((Address) => AddressArray.push(Address));
    date.map((Date) => DateArray.push(Date));
    
  });
  
  let i = 0;

  do {
    Data_collection +=
    ReferenceArray[i] +
    " " +
    PatientNameArray[i] +
    " " +
    AddressArray[i] +
    " " +
    Mobile_NumberArray[i] +
    " " +
    AgentNameArray[i] +
    " " +
    StatusArray[i] +
    " " +
    TrackingArray[i] +
    " " +
    DateArray[i] +
    "\n";
    i++;
  }
  while (i < 33);


  fs.writeFile("Output.md", Data_collection, (error) => {
    if (error) throw error;
  });

});

console.log("Data Fetched successfully ")
