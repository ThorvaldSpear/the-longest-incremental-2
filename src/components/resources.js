import{setupVue}from"../setup.js";import{DATA}from"../tmp.js";import Decimal,{D}from"../utils/break_eternity.js";import{format}from"../utils/format.js";export class Resource{constructor({name:t,color:s,src:e,prodFunc:r,based:a,multipliers:o}){this.name=t,this.color=s??"var(--font-color)",this.src=e,this.prodFunc=r??(()=>D(0)),this.based=a,this.multipliers=o}get amt(){return D(this.src.parent()?.[this.src.id]??0)}set amt(t){D(t).eq(0)?delete this.src.parent()[this.src.id]:this.src.parent()[this.src.id]=D(t)}get production(){return D(this.prodFunc())}set(t){this.amt=t}addWithoutMultipliers(t){this.amt=this.amt.add(t)}add(t){this.amt=this.amt.add(t)}sub(t){this.amt=this.amt.sub(t).max(0)}gte(t){return this.amt.gte(t)}}export const RESOURCES={};setupVue.resource={props:["name"],template:'\n    <div>\n      <span class="resource tooltip">\n        <b :style="{ color: resource_data.color }">\n          {{format(resource.amt.value)}} \n        </b>\n        {{resource_data.name}} \n        <span v-if="Decimal.gt(resource.prod.value, 0)" \n              :style="{ color: resource_data.color }"\n              style="font-size: 90%">\n          (+{{format(resource.prod.value)}}/sec)\n        </span>\n        <span class="tooltiptext" v-if="resource_data.based">\n          Based on: {{resource_data.based}}\n        </span>\n      </span>\n    </div>\n  ',setup(t){const s=DATA.resources[t.name],e=RESOURCES[t.name];return{Decimal:Decimal,resource:s,resource_data:e,format:format}}};
