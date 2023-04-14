import { useRouter } from 'next/router'
import Image from 'next/image'
import { useReducer, useState } from 'react'
import { useUser } from '../context/Context'
import { WithAuth } from '../HOCs/WithAuth'
import Layout from '../layout/Layout'
import Card from '../components/Card'
import ReactPDF from '@react-pdf/renderer';

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


import style from '../styles/CotizacionTerrestre.module.css'
import Button from '../components/Button'


function CotizacionMaritima() {
    const { user } = useUser()
    const router = useRouter()

    const [data, setData] = useState({})
    const [tarifa, setTarifa] = useState([""])
    const [otrosGastos, setOtrosGastos] = useState([""])
    const [incluye, setIncluye] = useState([""])
    const [excluye, setExcluye] = useState([""])

    const [calc, setCalc] = useState({})



    function handleEventChange(e) {
        setData({ ...data, ...{ [e.target.name]: e.target.value } })
    }

    function handlerCounter(word) {
        const newTarifa = tarifa.map(i => i)
        newTarifa.pop()
        word == "pluss" ? setTarifa([...tarifa, ...[""]]) : setTarifa(newTarifa)
    }
    function handlerCounterTwo(word) {
        const newTarifa = otrosGastos.map(i => i)
        newTarifa.pop()
        word == "pluss" ? setOtrosGastos([...otrosGastos, ...[""]]) : setOtrosGastos(newTarifa)
    }
    function handlerCounterThree(word) {
        const newIncluye = incluye.map(i => i)
        newIncluye.pop()
        word == "pluss" ? setIncluye([...incluye, ...[""]]) : setIncluye(newIncluye)
    }
    function handlerCounterFour(word) {
        const newExcluye = excluye.map(i => i)
        newExcluye.pop()
        word == "pluss" ? setExcluye([...excluye, ...[""]]) : setExcluye(newExcluye)
    }

    function handlerCalc(e, index) {

        if (e.target.name == `CANTIDADFLETE${index}` && calc[`FLETEUNITARIO${index}`] !== undefined) {
            let object = reducer(e, index, 'FLETEUNITARIO', 'PRODUCTFLETE', 'FLETETOTAL')
            setCalc({ ...calc, ...object })
            return
        }

        if (e.target.name == `FLETEUNITARIO${index}` && calc[`CANTIDADFLETE${index}`] !== undefined) {
            let object = reducer(e, index, 'CANTIDADFLETE', 'PRODUCTFLETE', 'FLETETOTAL')
            setCalc({ ...calc, ...object })
            return
        }

        if (e.target.name == `CANTIDAD${index}` && calc[`COSTOUNITARIO${index}`] !== undefined) {
            let object = reducer(e, index, 'COSTOUNITARIO', 'PRODUCT', 'TOTAL')
            setCalc({ ...calc, ...object })
            return
        }

        if (e.target.name == `COSTOUNITARIO${index}` && calc[`CANTIDAD${index}`] !== undefined) {
            let object = reducer(e, index, 'CANTIDAD', 'PRODUCT', 'TOTAL')
            setCalc({ ...calc, ...object })
            return
        }

        let object = {
            [e.target.name]: e.target.value,

        }
        setCalc({ ...calc, ...object })
    }

    function reducer(e, index, counter, prod, total) {
        let product = e.target.value * calc[`${counter}${index}`]

        let data = {
            ...calc,
            [e.target.name]: e.target.value,
            [`${prod}${index}`]: product,
        }

        let arr = Object.entries(data)

        let red = arr.reduce((ac, i) => {
            let str = i[0]
            if (str.includes(total)) {
                return ac
            }
            if (prod == 'PRODUCT' && str.includes('PRODUCTFLETE')) {
                return ac
            }
            let res = str.includes(prod)
            let r = res ? i[1] + ac : ac
            return r
        }, 0)

        let object = {
            [e.target.name]: e.target.value,
            [`${prod}${index}`]: product,
            PRODUCTOFLETETOTAL: prod === 'PRODUCTFLETE' ? red : data['PRODUCTOFLETETOTAL'],
            PRODUCTOTOTAL: prod === 'PRODUCT' ? red : data['PRODUCTOTOTAL'],
        }
        return object
    }


    return (
        <Layout>
            <div className={style.container}>
                <form className={style.form}>
                    <div className={style.subtitle}>COTIZACIÓN TRANSPORTE MARITIMO</div>
                    <div className={style.containerFirstItems}>
                        <div className={style.imgForm}>
                            <Image src="/logo.svg" width="250" height="150" alt="User" />
                        </div>
                        <div className={style.firstItems}>
                            <div>
                                <label htmlFor="">COTIZACIÓN No</label>
                                <input type="text" name={"COTIZACIÓN No"} onChange={handleEventChange} />
                            </div>
                            <div>
                                <label htmlFor="">FECHA</label>
                                <input type="text" name={"FECHA"} onChange={handleEventChange} />
                            </div>
                            <div>
                                <label htmlFor="">VALIDEZ</label>
                                <input type="text" name={"VALIDEZ"} onChange={handleEventChange} />
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className={style.subtitle}>DATOS DE CLIENTE</div>
                    <br />
                    <div className={style.items}>
                        <div>
                            <label htmlFor="">NOMBRE</label>
                            <input type="text" name={"NOMBRE"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">CORREO</label>
                            <input type="text" name={"CORREO"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">EMPRESA</label>
                            <input type="text" name={"EMPRESA"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">TELEFONO</label>
                            <input type="text" name={"TELEFONO"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">CARGO</label>
                            <input type="text" name={"CARGO"} onChange={handleEventChange} />
                        </div>

                        <div>
                            <label htmlFor="">CIUDAD</label>
                            <input type="text" name={"CIUDAD"} onChange={handleEventChange} />
                        </div>
                    </div>
                    <br />
                    <div className={style.subtitle}>DESCRIPCION DE LA CARGA</div>
                    <br />
                    <div className={style.items}>
                        <div>
                            <label htmlFor="">MERCANCIA</label>
                            <input type="text" name={"VALIDEZ"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">*TIPO DE CARGA</label>
                            <select name="TIPO DE CARGA" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="GENERAL">GENERAL</option>
                                <option value="PELIGROSA">PELIGROSA</option>
                                <option value="ESPECIAL">ESPECIAL</option>
                                <option value="REFRIGERADA">REFRIGERADA</option>
                                <option value="PROYECTO">PROYECTO</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">EMPAQUE</label>
                            <select name="EMPAQUE" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="CAJAS DE CARTON">CAJAS DE CARTON</option>
                                <option value="CAJAS DE MADERA">CAJAS DE MADERA</option>
                                <option value="CARGA SUELTA">CARGA SUELTA</option>
                                <option value="PALLETIZADO">PALLETIZADO</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">*VOLUMEN M3</label>
                            <input type="text" name={"VOLUMEN M3"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">*PESO TN</label>
                            <input type="text" name={"PESO TN"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">*CANTIDAD</label>
                            <input type="text" name={"CANTIDAD"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">INCOTERM</label>
                            <select name="INCOTERM" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="EXW">EXW</option>
                                <option value="FCA">FCA</option>
                                <option value="CPT">CPT</option>
                                <option value="CIP">CIP</option>
                                <option value="DAP">DAP</option>
                                <option value="DPU">DPU</option>
                                <option value="DDP">DDP</option>
                                <option value="CIF">CIF</option>
                                <option value="CFR">CFR</option>
                                <option value="FOB">FOB</option>
                                <option value="FAS">FAS</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">MODALIDAD</label>
                            <select name="MODALIDAD" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="MULTIMODAL">MULTIMODAL</option>
                                <option value="MARTIMO">MARTIMO</option>
                            </select>
                        </div>
                    </div>
                    <br />
                    <div className={style.subtitle}>DETALLES DEL SERVICIO</div>
                    <br />
                    <div className={style.items}>
                        <div>
                            <label htmlFor="">MEDIO DE TRANSPORTE</label>
                            <select name="SERVICIO" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="PORTA CONTENEDORES">PORTA CONTENEDORES</option>
                                <option value="BULK CARGO">BULK CARGO</option>
                                <option value="RORO">RORO</option>
                                <option value="CHARTER">CHARTER</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">EQUIPO</label>
                            <select name="EMPAQUE" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="20`STD">20`STD</option>
                                <option value="20`OT">20`OT</option>
                                <option value="20`FR">20`FR</option>
                                <option value="20`HARD TOP">20`HARD TOP</option>
                                <option value="20`OPEN SIDE">20`OPEN SIDE</option>
                                <option value="20`PLATAFORMA">20`PLATAFORMA</option>
                                <option value="20`RF">20`RF</option>
                                <option value="40`STD">40`STD</option>
                                <option value="40`HQ">40`HQ</option>
                                <option value="40`FR">40`FR</option>
                                <option value="40`OT">40`OT</option>
                                <option value="40`RF">40`RF</option>
                                <option value="40`HARD TOP">20`HARD TOP</option>
                                <option value="40`OPEN SIDE">20`OPEN SIDE</option>
                                <option value="40`PLATAFORMA">20`PLATAFORMA</option>
                                <option value="MAFI">20`HARD TOP</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">*ORIGEN</label>
                            <input type="text" name={"ORIGEN"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">*DESTINO</label>
                            <input type="text" name={"DESTINO"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">*CANTIDAD</label>
                            <input type="text" name={"CANTIDAD"} onChange={handleEventChange} />
                        </div>

                        <div>
                            <label htmlFor="">*MONEDA</label>
                            <input type="text" name={"MONEDA"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">CARRIER</label>
                            <input type="text" name={"CANTIDAD"} onChange={handleEventChange} />
                        </div>

                        <div>
                            <label htmlFor="">SERVICIO</label>
                            <select name="EMPAQUE" onChange={handleEventChange}>
                                <option value="">Seleccione una opcion</option>
                                <option value="20`OT">EXPORTACIÓN</option>
                                <option value="20`OT">IMPORTACIÓN</option>

                            </select>
                        </div>
                    </div>





                    {
                        data && data["SERVICIO"] && data["SERVICIO"] == "PORTA CONTENEDORES" && <>
                            <br />
                            <div className={style.subtitle}>TARIFA (Porta contenedores)<span className={style.counterPluss} onClick={() => handlerCounter('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounter('less')}>-</span></div>
                            <br />

                            <div className={`${style.containerFirstItems} ${style.desktop}`}>
                                <span>DETALLE</span>
                                <span>FLETE UNITARIO</span>
                                <span>CANTIDAD</span>
                                <span>FLETE TOTAL</span>
                            </div>
                            {
                                tarifa.map((i, index) => {
                                    return (
                                        <div className={`${style.inputs}`} key={index}>
                                            <input type="text" placeholder="DETALLE" />
                                            <input type="number" name={`FLETEUNITARIO${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`FLETEUNITARIO${index}`] && calc[`FLETEUNITARIO${index}`]} placeholder="FLETE UNITARIO" />
                                            <input type="number" name={`CANTIDADFLETE${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`CANTIDADFLETE${index}`] && calc[`CANTIDADFLETE${index}`]} placeholder="CANTIDAD" />
                                            <input type="number" defaultValue={calc[`PRODUCTFLETE${index}`] && calc[`PRODUCTFLETE${index}`]} placeholder="FLETE TOTAL" />                                        </div>
                                    )
                                })
                            }
                        </>
                    }

                    {
                        data && data["SERVICIO"] && data["SERVICIO"] !== "" && data["SERVICIO"] !== "PORTA CONTENEDORES" && <>
                            <br />
                            <div className={style.subtitle}>TARIFA (Bulk cargo, charter o roro)<span className={style.counterPluss} onClick={() => handlerCounter('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounter('less')}>-</span></div>
                            <br />

                            <div className={`${style.containerFirstItems} ${style.desktop}`}>
                                <span>DETALLE</span>
                                <span>FLETE W/M</span>
                                <span>W/M</span>
                                <span>FLETE TOTAL</span>
                            </div>
                            {
                                tarifa.map((i, index) => {
                                    return (
                                        <div className={`${style.inputs}`} key={index}>
                                            <input type="text" placeholder="DETALLE" />
                                            <input type="number" name={`FLETEUNITARIO${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`FLETEUNITARIO${index}`] && calc[`FLETEUNITARIO${index}`]} placeholder="FLETE W/M" />
                                            <input type="number" name={`CANTIDADFLETE${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`CANTIDADFLETE${index}`] && calc[`CANTIDADFLETE${index}`]} placeholder="W/M" />
                                            <input type="number" defaultValue={calc[`PRODUCTFLETE${index}`] && calc[`PRODUCTFLETE${index}`]} placeholder="FLETE TOTAL" />
                                        </div>
                                    )
                                })
                            }
                        </>
                    }
                      <div className={`${style.containerFirstItems}`}>
                        <span></span>
                        <span></span>
                        <span>TOTAL FLETES</span>
                        <p>{calc[`PRODUCTOFLETETOTAL`] && calc[`PRODUCTOFLETETOTAL`]}</p>
                    </div>
                    <br />
                    <div className={style.subtitle}>OTROS GASTOS <span className={style.counterPluss} onClick={() => handlerCounterTwo('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounterTwo('less')}>-</span></div>
                    <br />
                    <div className={`${style.containerFirstItems} ${style.desktop}`}>
                        <span>DETALLE</span>
                        <span>COSTO UNITARIO</span>
                        <span>CANTIDAD</span>
                        <span>COSTO TOTAL</span>
                    </div>
                    {
                        otrosGastos.map((i, index) => {

                            return (
                                <div className={`${style.inputs}`} key={index}>
                                    <input type="text" placeholder="DETALLE" />
                                    <input type="number" name={`COSTOUNITARIO${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`COSTOUNITARIO${index}`] && calc[`COSTOUNITARIO${index}`]} placeholder="COSTO UNITARIO" />
                                    <input type="number" name={`CANTIDAD${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`CANTIDAD${index}`] && calc[`CANTIDAD${index}`]} placeholder="CANTIDAD" />
                                    <input type="number" defaultValue={calc[`PRODUCT${index}`] && calc[`PRODUCT${index}`]} placeholder="COSTO TOTAL" />
                                </div>
                            )

                        })
                    }
                      <div className={`${style.containerFirstItems}`}>
                        <span></span>
                        <span></span>
                        <span>TOTAL OTROS GASTOS</span>
                        <p>{calc[`PRODUCTOTOTAL`] && calc[`PRODUCTOTOTAL`]}</p>
                    </div>
                    <br />

                    <div className={style.inputsSemi}>
                        <label htmlFor="">Costo Total</label><input type="text" defaultValue={calc.PRODUCTOTOTAL && calc.PRODUCTOFLETETOTAL ? calc.PRODUCTOTOTAL + calc.PRODUCTOFLETETOTAL : (calc.PRODUCTOTOTAL ? calc.PRODUCTOTOTAL : (calc.PRODUCTOFLETETOTAL && calc.PRODUCTOFLETETOTAL))} />
                    </div>

                    <br />
                    <div className={style.subtitle}>INCLUYE <span className={style.counterPluss} onClick={() => handlerCounterThree('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounterThree('less')}>-</span></div>

                    {
                        incluye.map((i, index) => {
                            return (

                                <div className={style.inputsAll} key={index}>
                                    <input type="text" />
                                </div>

                            )
                        })
                    }
                    <br />
                    <div className={style.subtitle}>EXCLUYE <span className={style.counterPluss} onClick={() => handlerCounterFour('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounterFour('less')}>-</span></div>

                    {
                        excluye.map((i, index) => {
                            return (

                                <div className={style.inputsAll} key={index}>
                                    <input type="text" />
                                </div>
                            )
                        })
                    }
                </form>
            </div>

            <br />
            <br />
        </Layout>
    )
}

export default WithAuth(CotizacionMaritima)

