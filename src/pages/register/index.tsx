import { useState } from "react";
import Head from "next/head";
import { Button, Center, Flex, Input, Text } from "@chakra-ui/react";
import logoImg from "../../../public/images/logo.svg";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  function handleRegister() {
    alert("cliucou");
  }
  return (
    <>
      <Head>
        <title>BarberPRO - Faça seu cadastro</title>
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
            placeholder="Nome da barbearia"
            type="text"
            mb={3}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            onClick={handleRegister}
          >
            Acessar
          </Button>

          <Center mt={2}>
            <Link href="/login">
              <Text color="#eee" cursor="pointer">
                Já possui uma conta? <strong>Acessar</strong>{" "}
              </Text>
            </Link>
          </Center>
        </Flex>
      </Flex>
    </>
  );
}
