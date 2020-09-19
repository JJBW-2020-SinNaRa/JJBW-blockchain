import fs from 'fs';
import path from "path";
const Caver = require('caver-js');
export const caver = new Caver(process.env.API_ENDPOINT);
const contract = fs.readFileSync(path.join(path.join(__dirname, '../../'), 'ABI.json'), 'utf-8');
export const Service = new caver.contract(JSON.parse(contract), process.env.CONTRACT_ADDRESS)
