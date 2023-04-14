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


function CotizacionTerrestre() {
    const { user, pdfData, setUserPdfData } = useUser()
    const router = useRouter()

    const [tarifa, setTarifa] = useState([""])
    const [otrosGastos, setOtrosGastos] = useState([""])
    const [incluye, setIncluye] = useState([""])

    const [calc, setCalc] = useState({})

    function handleEventChange(e) {
        setUserPdfData({ ...pdfData, ...{ [e.target.name]: e.target.value } })
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

    function handlerPdfButton() {
        router.push("/PdfView")
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

    console.log(calc)
    return (
        <Layout>
            <div className={style.container}>
                <form className={style.form}>
                    <div className={style.subtitle}>COTIZACIÓN TRANSPORTE AREO</div>
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
                            <input type="text" name={"MERCANCIA"} onChange={handleEventChange} />
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
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">PESO KG</label>
                            <input type="text" name={"PESO KG"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">VOLUMEN M3</label>
                            <input type="text" name={"VOLUMEN M3"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">LARGO CM</label>
                            <input type="text" name={"LARGO CM"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">ANCHO CM</label>
                            <input type="text" name={"ANCHO CM"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">ALTO CM</label>
                            <input type="text" name={"ALTO CM"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">*CANTIDAD</label>
                            <input type="text" name={"CANTIDAD"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">KG VOLUMEN</label>
                            <input type="text" name={"KG VOLUMEN"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">KG CARGABLE</label>
                            <input type="text" name={"KG CARGABLE"} onChange={handleEventChange} />
                        </div>

                    </div>
                    <br />
                    <div className={style.subtitle}>DETALLES DEL SERVICIO</div>
                    <br />
                    <div className={style.items}>


                        <div>
                            <label htmlFor="">ORIGEN</label>
                            <input type="text" name={"ORIGEN"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">DESTINO</label>
                            <input type="text" name={"DESTINO"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">AEROLINEA</label>
                            <input type="text" name={"CANTIDAD"} onChange={handleEventChange} />
                        </div>

                        <div>
                            <label htmlFor="">MONEDA</label>
                            <input type="text" name={"MONEDA"} onChange={handleEventChange} />
                        </div>
                    </div>
                    <br />
                    <div className={style.subtitle}>TARIFA <span className={style.counterPluss} onClick={() => handlerCounter('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounter('less')}>-</span></div>
                    <br />
                    <div className={`${style.containerFirstItems} ${style.desktop}`}>
                        <span>DETALLE</span>
                        <span>FLETE KG</span>
                        <span>W/M</span>
                        <span>FLETE TOTAL</span>
                    </div>
                    {
                        tarifa.map((i, index) => {
                            return (
                                <div className={`${style.inputs}`} key={index}>
                                    <input type="text" placeholder="DETALLE" />
                                    <input type="text" name={`FLETEUNITARIO${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`FLETEUNITARIO${index}`] && calc[`FLETEUNITARIO${index}`]} placeholder="FLETE KG" />
                                    <input type="text" name={`CANTIDADFLETE${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`CANTIDADFLETE${index}`] && calc[`CANTIDADFLETE${index}`]} placeholder="W/M" />
                                    <input type="text" defaultValue={calc[`PRODUCTFLETE${index}`] && calc[`PRODUCTFLETE${index}`]} placeholder="FLETE TOTAL" />
                                </div>
                            )
                        })
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
                                    <input type="text" name={`COSTOUNITARIO${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`COSTOUNITARIO${index}`] && calc[`COSTOUNITARIO${index}`]} placeholder="COSTO UNITARIO" />
                                    <input type="text" name={`CANTIDAD${index}`} onChange={(e) => handlerCalc(e, index)} defaultValue={calc[`CANTIDAD${index}`] && calc[`CANTIDAD${index}`]} placeholder="CANTIDAD" />
                                    <input type="text" defaultValue={calc[`PRODUCT${index}`] && calc[`PRODUCT${index}`]} placeholder="COSTO TOTAL" />
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
                    <br />
                    <div className={style.subtitle}> NO INCLUYE <span className={style.counterPluss} onClick={() => handlerCounterThree('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounterThree('less')}>-</span></div>
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
                </form>
            </div>
            <button className={style.downloadPDF} onClick={handlerPdfButton}>
                <Image src="/download-pdf.svg" width="50" height="50" alt="User" />
            </button>
            <br />
            <br />
        </Layout>
    )
}

export default WithAuth(CotizacionTerrestre)








