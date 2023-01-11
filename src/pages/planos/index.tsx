import Head from "next/head";
import { Button, Flex, Heading, Text, useMediaQuery } from "@chakra-ui/react";
import { Sidebar } from "../../components/sidebar";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "./../../services/api";
import { getStripeJs } from "../../services/stripe-js";

interface PlanosProps {
  premium: boolean;
}

export default function Planos({ premium }: PlanosProps) {
  const [isMobile] = useMediaQuery("(max-widht:500px)");

  async function handleSubscribe() {
    if (premium) {
      return;
    }

    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({
        sessionId: sessionId,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Barber Pro - Sua assinatura Premium</title>
      </Head>
      <Sidebar>
        <Flex
          w="100%"
          direction="column"
          align="flex-start"
          justify="flex-start"
        >
          <Heading color="white" fontSize="3xl" mt={4} mb={4} mr={4}>
            Planos
          </Heading>
        </Flex>

        <Flex
          pb={8}
          maxW="780px"
          w="100%"
          direction="column"
          align="flex-start"
          justify="flex-start"
        >
          <Flex gap={4} w="100%" flexDirection={isMobile ? "column" : "row"}>
            <Flex
              rounded={4}
              p={2}
              flex={1}
              bg="barber.400"
              flexDirection="column"
            >
              <Heading
                textAlign="center"
                fontSize="2xl"
                mt={2}
                mb={4}
                color="gray.100"
              >
                Plano Grátis
              </Heading>

              <Text fontWeight="medium" ml={4} mb={2}>
                Registrar cortes.
              </Text>
              <Text fontWeight="medium" ml={4} mb={2}>
                Criar apenas 3 modelos de corte.
              </Text>
              <Text fontWeight="medium" ml={4} mb={2}>
                Editar dados do perfil.
              </Text>
            </Flex>

            <Flex
              rounded={4}
              p={2}
              flex={1}
              bg="barber.400"
              flexDirection="column"
            >
              <Heading
                textAlign="center"
                fontSize="2xl"
                mt={2}
                mb={4}
                color="#31fb6a"
              >
                Premium
              </Heading>

              <Text fontWeight="medium" ml={4} mb={2}>
                Registrar cortes ilimitados.
              </Text>
              <Text fontWeight="medium" ml={4} mb={2}>
                Criar modelos ilimitados.
              </Text>
              <Text fontWeight="medium" ml={4} mb={2}>
                Editar modelos de corte.
              </Text>
              <Text fontWeight="medium" ml={4} mb={2}>
                Editar dados do perfil.
              </Text>
              <Text fontWeight="medium" ml={4} mb={2}>
                Receber todas atualizações.
              </Text>
              <Text
                color="#31fb6a"
                fontWeight="bold"
                fontSize="2xl"
                ml={4}
                mb={2}
              >
                R$ 12.90
              </Text>

              <Button
                bg={premium ? "gray.700" : "button.cta"}
                m={2}
                color={premium ? "#fff" : "gray.800"}
                fontWeight="bold"
                onClick={handleSubscribe}
                disabled={premium}
              >
                {premium ? "Você já é premium" : "Virar Premium"}
              </Button>

              {premium && (
                <Button
                  m={2}
                  bg="white"
                  color="gray.900"
                  fontWeight="bold"
                  onClick={() => {}}
                >
                  Alterar assinatura
                </Button>
              )}
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

    console.log(response.data);

    return {
      props: {
        premium:
          response.data?.user?.subscriptions?.status === "active"
            ? true
            : false,
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
