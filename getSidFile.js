const ex = require("express")
const app = ex()
const bodyParser = require("body-parser")
const bp = bodyParser.urlencoded({extended:true})
let sig;
async function getSig(data){
	var config = {
	method: "GET",
	 url: `https://DentalGlossyOffices.saifabbosh.repl.co?data=${data}`
	}
	sig = await axios(config)
}
async function getSid(email,password,deviceid){
	let data = JSON.stringify({"email":email,"v":2,"secret":`0 ${password}`,"deviceID":deviceid,"clientType":100,"action":"normal","timestamp":parseInt(new Date().getTime()*1000)})
	await getSig(data)
	let headers = {"NDCDEVICEID":deviceid,"NDC-MSG-SIG":sig,"Content-Type":"application/json; charset=utf-8"}
	var config = {
	method: "POST",
	 url: "https://service.narvii.com/api/v1/g/s/auth/login",
	 data: data,
	 headers: headers
	}
	let dat = await axios(config)
	return dat["sid"]
}
app.get('/',bp,(req,res,next)=>{
	getSid(req.query.email,req.query.password,req.query.deviceid).then(sid=>{
		res.end(sid)
	})
})