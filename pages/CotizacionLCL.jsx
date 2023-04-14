import { useRouter } from 'next/router'
import Image from 'next/image'
import { useReducer, useState } from 'react'
import { useUser } from '../context/Context'
import { WithAuth } from '../HOCs/WithAuth'
import Layout from '../layout/Layout'
import Card from '../components/Card'
import ReactPDF from '@react-pdf/renderer';
import { writeUserData } from '../firebase/utils';


import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


import style from '../styles/CotizacionLCL.module.css'
import Button from '../components/Button'


function CotizacionTerrestre() {
    const { user, pdfData, setUserPdfData, setUserSuccess } = useUser()
    const router = useRouter()

    const [tarifa, setTarifa] = useState([""])
    const [otrosGastos, setOtrosGastos] = useState([""])
    const [incluye, setIncluye] = useState([""])
    const [counter, setCounter] = useState({})
    const [calc, setCalc] = useState({})

    function handleEventChange(e) {
        setUserPdfData({ ...pdfData, ...{ [`NC-${e.target.name}`]: e.target.value } })
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

        let object = {
            nombre: pdfData['NC-NOMBRE'],
            correo: pdfData['NC-CORREO'],
            empresa: pdfData['NC-NOMBRE'],
            telefono: pdfData['NC-CORREO'],
            cargo: pdfData['NC-NOMBRE'],
            ciudad: pdfData['NC-CORREO'],

            banco: pdfData['NC-BANCO'] ? pdfData['NC-BANCO'] : null,
            codigo: pdfData['NC-CODIGO SWIFT'] ? pdfData['NC-CODIGO SWIFT'] : null,
            direcccionDeBanco: pdfData['NC-DIRECCION DE BANCO'] ? pdfData['NC-DIRECCION DE BANCO'] : null,
            nombre2: pdfData['NC-NOMBRE2'] ? pdfData['NC-NOMBRE2'] : null,
            cuentaBS: pdfData['NC-NUMERO DE CUENTA EN BS'] ? pdfData['NC-NUMERO DE CUENTA EN BS'] : null,
            cuentaUSD: pdfData['NC-NUMERO DE CUENTA EN USD'] ? pdfData['NC-NUMERO DE CUENTA EN USD'] : null,
            tipoDeCuenta: pdfData['NC-TIPO DE CUENTA'] ? pdfData['NC-TIPO DE CUENTA'] : null
    }

    pdfData['NC-NOMBRE'] && pdfData['NC-CORREO'] && pdfData['NC-EMPRESA'] && pdfData['NC-TELEFONO'] && pdfData['NC-CARGO'] && pdfData['NC-CIUDAD']
        ? writeUserData(`users/${object.telefono}`, object, setUserSuccess)
        : ''

    router.push("/PdfView")
}



function handlerCalc(e, index) {

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
        let res = str.includes(prod)
        let r = res ? i[1] + ac : ac
        return r
    }, 0)

    let object = {
        [e.target.name]: e.target.value,
        [`${prod}${index}`]: product,
        PRODUCTOTOTAL: prod === 'PRODUCT' ? red : data['PRODUCTOTOTAL'],
    }
    return object
}

console.log(pdfData)



return (
    <Layout>
        <div className={style.container}>
            <form className={style.form}>
                <div className={style.subtitle}>COTIZACIÓN TRANSPORTE TERRESTRE</div>
                <div className={style.containerFirstItems}>
                    <div className={style.imgForm}>
                        <Image src="/logo.svg" width="250" height="150" alt="User" />
                    </div>
                    <div className={style.firstItems}>
                        <div>
                            <label htmlFor="">NOTA DE COBRANZA NO</label>
                            <input type="text" name={"NOTA DE COBRANZA NO"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">FECHA</label>
                            <input type="text" name={"FECHA"} onChange={handleEventChange} />
                        </div>

                    </div>
                </div>
                <br />
                <div className={style.subtitle}>DATOS DE CLIENTE</div>
                <br />
                <div className={style.items}>
                    <div>
                        <label htmlFor="">NOMBRE</label>
                        <input type="text" name={"NOMBRE"} onChange={handleEventChange}  />
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
                <div className={style.subtitle}>DESCRIPCION DE SERVICIO</div>
                <br />
                <div className={style.items}>
                    <div>
                        <label htmlFor="">NÚMERO DE SERVICIO</label>
                        <input type="text" name={"MERCANCIA"} onChange={handleEventChange} />
                    </div>

                    <div>
                        <label htmlFor="">MONEDA</label>
                        <input type="text" name={"VOLUMEN M3"} onChange={handleEventChange} />
                    </div>
                    <div>
                        <label htmlFor="">MERCANCÍA</label>
                        <input type="text" name={"PESO TN"} onChange={handleEventChange} />
                    </div>
                    <div>
                        <label htmlFor="">TIPO DE CAMBIO</label>
                        <input type="text" name={"CANTIDAD"} onChange={handleEventChange} />
                    </div>
                    <div>
                        <label htmlFor="">TIPO DE CARGA</label>
                        <input type="text" name={"MERCANCIA"} onChange={handleEventChange} />
                    </div>

                    <div>
                        <label htmlFor="">CONDICIONES DE PAGO</label>
                        <input type="text" name={"VOLUMEN M3"} onChange={handleEventChange} />
                    </div>
                    <div>
                        <label htmlFor="">TIPO DE SERVICIO</label>
                        <input type="text" name={"PESO TN"} onChange={handleEventChange} />
                    </div>
                    <div>
                        <label htmlFor="">CONTRATO/COTIZACIÓN</label>
                        <input type="text" name={"CANTIDAD"} onChange={handleEventChange} />
                    </div>

                </div>
                <br />


                <div className={style.subtitle}>DESCRPCION<span className={style.counterPluss} onClick={() => handlerCounter('pluss')}>+</span> <span className={style.counterLess} onClick={() => handlerCounter('less')}>-</span></div>

                <br />
                <div className={`${style.containerFirstItems2} ${style.desktop}`}>
                    <span>DETALLE</span>
                    <span>COSTO UNITARIO</span>
                    <span>CANTIDAD</span>
                    <span>COSTO TOTAL</span>
                    <span>FACTURA</span>
                    <span>OBSERVACION</span>
                </div>
                {
                    tarifa.map((i, index) => {
                        return (
                            <div className={`${style.inputs}`} key={index}>
                                <input type="text" placeholder="DETALLE" />
                                <input type="text" name={`COSTOUNITARIO${index}`} onChange={(e) => handlerCalc(e, index)} placeholder="COSTO UNITARIO" />
                                <input type="text" name={`CANTIDAD${index}`} onChange={(e) => handlerCalc(e, index)} placeholder="CANTIDAD" />
                                <input type="text" defaultValue={calc[`PRODUCT${index}`] && calc[`PRODUCT${index}`]} placeholder="COSTO TOTAL" />
                                <input type="number" placeholder="FACTURA" />
                                <input type="number" placeholder="OBSERVACION" />
                            </div>
                        )
                    })
                }
                <div className={`${style.inputs}`} >
                    <span className={style.total}>TOTAL</span>
                    <span className={style.span}>{calc[`PRODUCTOTOTAL`] && calc[`PRODUCTOTOTAL`]}</span>
                </div>
                <br />
                <div className={style.subtitle}>DATOS BANCARIOS</div>
                <br />
                <div className={style.containerFirstItems}>

                    <div className={style.firstItems}>
                        <div>
                            <label htmlFor="">BANCO</label>
                            <input type="text" name={"BANCO"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">DIRECCION DE BANCO</label>
                            <input type="text" name={"DIRECCION DE BANCO"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">CODIGO SWIFT</label>
                            <input type="text" name={"CODIGO SWIFT"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">NUMERO DE CUENTA EN BS</label>
                            <input type="text" name={"NUMERO DE CUENTA EN BS"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">NUMERO DE CUENTA EN USD</label>
                            <input type="text" name={"NUMERO DE CUENTA EN USD"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">TIPO DE CUENTA</label>
                            <input type="text" name={"TIPO DE CUENTA"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">NOMBRE</label>
                            <input type="text" name={"NOMBRE2"} onChange={handleEventChange} />
                        </div>
                        <div>
                            <label htmlFor="">DIRECCION</label>
                            <input type="text" name={"DIRECCION"} onChange={handleEventChange} />
                        </div>
                    </div>   </div>
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
