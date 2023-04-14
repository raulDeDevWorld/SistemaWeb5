import { useRouter } from 'next/router'
import Image from 'next/image'
import { useUser } from '../context/Context'
import { WithAuth } from '../HOCs/WithAuth'
import Layout from '../layout/Layout'
import Card from '../components/Card'

import style from '../styles/Admin.module.css'

function Admin() {
    const { user } = useUser()
    const router = useRouter()

    function redirection (url) {
        router.push(url)
    }

    return (
        <Layout>

            <div className={style.container}>
                <div className={style.imgContainer}>
                    <Image src="/logo-horizontal.png" width="600" height="200" alt="User" />
                </div>

                <div className={style.grid}>
                    <Card img="/clipboard.svg" buttonText={"Administrar Clientes"} click={(e) => redirection("AdministrarClientes")} />
                    <Card img="/delivery-truck.svg" buttonText={"Cotizacion LCL"} click={(e) => redirection("CotizacionLCL")} />
                    <Card img="/cargo-ship.svg" buttonText={"Cotizacion Maritima"} click={(e) => redirection("CotizacionMaritima")} />
                    <Card img="/box.svg" buttonText={"Cotizacion Terrestre"} click={(e) => redirection("CotizacionTerrestre")} />
                    <Card img="/airplane.svg" buttonText={"Cotizacion Aerea"} click={(e) => redirection("CotizacionAerea")} />
                    <Card img="/agreement.svg" buttonText={"Manifiesto De Carga"} click={(e) => redirection("ManifiestoDeCarga")} />
                </div>
            </div>
        </Layout>

    )
}

export default WithAuth(Admin)