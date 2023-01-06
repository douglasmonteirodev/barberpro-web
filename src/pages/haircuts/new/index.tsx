import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { Sidebar } from "../../../components/sidebar";
import { FiChevronLeft } from "react-icons/fi";
import { canSSRAuth } from "../../../utils/canSSRAuth";
import { setupAPIClient } from "../../../services/api";

interface NewHaircutProps {
  subscription: boolean;
  count: number;
}

export default function NewHaircut({ subscription, count }: NewHaircutProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  return (
    <>
      <Head>
        <title>BarberPRO - Novo modelo de corte</title>
      </Head>
      <Sidebar>
        <Flex
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Flex
            direction={isMobile ? "column" : "row"}
            w="100%"
            align={isMobile ? "flex-start" : "center"}
            mb={isMobile ? 4 : 0}
          >
            <Link href="/haircuts" legacyBehavior>
              <Button
                bg="gray.700"
                p={4}
                display="flex"
                justifyContent="center"
                alignItems="center"
                mr={4}
              >
                <FiChevronLeft size={24} />
                Voltar
              </Button>
            </Link>

            <Heading
              fontSize={isMobile ? "28px" : "3xl"}
              color="orange.900"
              mt={4}
              mb={4}
              mr={4}
            >
              Modelos de corte
            </Heading>
          </Flex>

          <Flex
            maxW="700px"
            bg="barber.400"
            w="100%"
            align="center"
            justify="center"
            pt={8}
            pb={8}
            direction="column"
          >
            <Heading fontSize={isMobile ? "22px" : "3xl"} color="#fff" mb={4}>
              Cadastrar modelo
            </Heading>

            <Input
              placeholder="Nome do corte"
              size="lg"
              type="text"
              w="85%"
              bg="gray.900"
              mb={3}
              disabled={!subscription && count >= 3}
            />
            <Input
              placeholder="Valor do corte ex: R$49.99"
              size="lg"
              type="text"
              w="85%"
              bg="gray.900"
              mb={4}
              disabled={!subscription && count >= 3}
            />

            <Button
              size="lg"
              w="85%"
              color="gray.900"
              bg="button.cta"
              _hover={{ bg: "#ffb13e" }}
              disabled={!subscription && count >= 3}
            >
              Cadastrar
            </Button>

            {!subscription && count >= 3 && (
              <Flex direction="row" justifyContent="center" alignItems="center">
                <Text>Você atingiu seu limite de cortes.</Text>
                <Link href="/planos">
                  <Text
                    ml={1}
                    fontWeight="bold"
                    color="#31fb6a"
                    cursor="pointer"
                  >
                    Seja Premium
                  </Text>
                </Link>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get("/haircut/check");
    const count = await apiClient.get("/haircut/count");

    return {
      props: {
        subscription:
          response.data?.subscriptions?.status === "active" ? true : false,
        count: count.data,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
});
