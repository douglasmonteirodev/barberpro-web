import { useState, useContext } from "react";
import Head from "next/head";
import { Button, Center, Flex, Input, Text } from "@chakra-ui/react";
import logoImg from "../../../public/images/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    await signIn({ email, password });
  }

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
        <Flex width={640} direction="column" p={14} rounded={8}>
          <Center p={4}>
            <Image src={logoImg} quality={100} alt="logo" width={240} />
          </Center>

          <Input
            background="barber.400"
            variant="filled"
            size="lg"
            placeholder="email@email.com"
            type="email"
            mb={3}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            background="barber.400"
            variant="filled"
            size="lg"
            placeholder="************"
            type="text"
            mb={3}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            background="button.cta"
            mb={6}
            color="gray.900"
            size="lg"
            _hover={{ bg: "#fcb449" }}
            onClick={handleLogin}
          >
            Acessar
          </Button>

          <Center mt={2}>
            <Link href="/register">
              <Text color="#eee" cursor="pointer">
                Ainda não possui uma conta? <strong>Cadastre-se</strong>{" "}
              </Text>
            </Link>
          </Center>
        </Flex>
      </Flex>
    </>
  );
}
