import Head from "next/head";
import { Flex, Text, Heading, Box, Input, Button } from "@chakra-ui/react";
import { Sidebar } from "../../components/sidebar";
import Link from "next/link";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { setupAPIClient } from "../../services/api";

interface UserProps {
  id: string;
  name: string;
  email: string;
  endereco: string | null;
}

interface ProfileProps {
  user: UserProps;
  premium: boolean;
}

export default function Profile({ user, premium }: ProfileProps) {
  const { logoutUser } = useContext(AuthContext);

  const [name, setName] = useState(user && user?.name);
  const [endereco, setEndereco] = useState(user && user?.endereco);

  async function handleLogout() {
    await logoutUser();
  }
  async function handleUpdateUser() {
    if (name === "" || endereco === "") {
      return;
    }

    try {
      const apiClient = setupAPIClient();

      await apiClient.put("/users", {
        name,
        endereco,
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Head>
        <title>BarberPRO - Minha Conta</title>
      </Head>
      <Sidebar>
        <Flex
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Flex
            w="100%"
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Heading fontSize="3xl" mt={4} mb={4} mr={4} color="orange.900">
              Minha Conta
            </Heading>
          </Flex>

          <Flex
            maxW="700px"
            w="100%"
            direction="column"
            justifyContent="center"
            alignItems="center"
            bg="barber.400"
            pt={8}
            pb={8}
          >
            <Flex direction="column" w="85%">
              <Text mb={2} fontSize="2xl" fontWeight="bold" color="white">
                Nome da barbearia:
              </Text>
              <Input
                w="100%"
                bg="gray.900"
                placeholder="Nome da sua barbearia"
                size="lg"
                type="text"
                mb={3}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Text mb={2} fontSize="2xl" fontWeight="bold" color="white">
                Endereço da barbearia:
              </Text>
              <Input
                w="100%"
                bg="gray.900"
                placeholder="Nome da sua barbearia"
                size="lg"
                type="text"
                mb={3}
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />

              <Text mb={2} fontSize="2xl" fontWeight="bold" color="white">
                Plano atual:
              </Text>

              <Flex
                direction="row"
                w="100%"
                mb={3}
                p={1}
                borderWidth={1}
                rounded={6}
                bg="barber.900"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text
                  p={2}
                  fontSize="lg"
                  color={premium ? "#fba931" : "#4dffb4"}
                >
                  Plano {premium ? "Premium" : "grátis"}
                </Text>

                <Link href="/planos">
                  <Box
                    cursor="pointer"
                    p={1}
                    pl={2}
                    pr={2}
                    bg="#00cd52"
                    rounded={4}
                    color="#fff"
                  >
                    Mudar de plano
                  </Box>
                </Link>
              </Flex>
              <Button
                w="100%"
                mt={3}
                mb={4}
                bg="button.cta"
                size="lg"
                _hover={{ bg: "#ffb13e" }}
                onClick={handleUpdateUser}
              >
                Salvar
              </Button>
              <Button
                w="100%"
                mb={6}
                bg="transparent"
                size="lg"
                borderWidth={2}
                borderColor="red.500"
                _hover={{ bg: "transparent" }}
                color="red.500"
                onClick={handleLogout}
              >
                Sair da conta
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}
export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/me");

    const user = {
      id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
      endereco: response.data?.user.endereco,
    };

    return {
      props: {
        user: user,
        premium:
          response.data?.user?.subscriptions?.status === "active"
            ? true
            : false,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
});
