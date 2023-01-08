import Head from "next/head";
import { Center, Flex } from "@chakra-ui/react";
import logoImg from "../../public/images/logo.svg";
import Image from "next/image";
import { canSSRAuth } from "../utils/canSSRAuth";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>BarberPRO - Faça login para acessar</title>
      </Head>
      <Flex
        background="barber.900"
        height="100vh"
        alignItems="center"
        justifyContent="center"
        color="#fff"
      >
        <Flex
          width={640}
          direction="column"
          p={14}
          rounded={8}
          cursor="pointer"
        >
          <Center p={4}>
            <Link href="/dashboard">
              <Image src={logoImg} quality={100} alt="logo" width={450} />
            </Link>
          </Center>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
