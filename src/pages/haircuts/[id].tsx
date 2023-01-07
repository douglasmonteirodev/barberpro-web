import Head from "next/head";
import {
  Flex,
  Text,
  Heading,
  Button,
  useMediaQuery,
  Input,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { Sidebar } from "../../components/sidebar";
import { FiChevronLeft } from "react-icons/fi";
import Link from "next/link";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "./../../services/api";
import { useState, ChangeEvent } from "react";
import Router from "next/router";

interface HaircutProps {
  id: string;
  name: string;
  price: string | number;
  status: boolean;
  user_id: string;
}

interface SubscriptionProps {
  id: string;
  status: string;
}

interface EditHaircutProps {
  haircut: HaircutProps;
  subscription: SubscriptionProps | null;
}

export default function EditHaircut({
  haircut,
  subscription,
}: EditHaircutProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  const [name, setName] = useState(haircut?.name);
  const [price, setPrice] = useState(haircut?.price);
  const [status, setStatus] = useState(haircut?.status);

  const [disableHaircut, setDisableHaircut] = useState(
    haircut?.status ? "disabled" : "enabled"
  );

  function handleChangeStatus(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value === "disabled") {
      setDisableHaircut("enable");
      setStatus(false);
    } else {
      setDisableHaircut("disabled");
      setStatus(true);
    }
  }

  async function handleUptade() {
    if (name === "" || price === "") {
      return;
    }
    try {
      const apiClient = setupAPIClient();
      await apiClient.put("/haircut", {
        name: name,
        price: Number(price),
        status: status,
        haircut_id: haircut?.id,
      });
      Router.push("/haircuts");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>BarberPRO - Editar modelo de corte</Head>

      <Sidebar>
        <Flex
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Flex
            direction={isMobile ? "column" : "row"}
            w="100%"
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent="flex-start"
            mb={isMobile ? 4 : 0}
          >
            <Link href="/haircuts">
              <Button
                bg="gray.700"
                p={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
                mr={4}
              >
                <FiChevronLeft size={24} />
                Voltar
              </Button>
            </Link>
            <Heading fontSize={isMobile ? "22px" : "3xl"} color="#fff">
              Editar corte
            </Heading>
          </Flex>

          <Flex
            maxW="700px"
            pt={8}
            pb={8}
            direction="column"
            align="center"
            justify="center"
            w="100%"
            bg="barber.400"
            mt={4}
          >
            <Heading fontSize={isMobile ? "22px" : "3xl"} mb={4}>
              Editar corte
            </Heading>
            <Flex w="85%" direction="column">
              <Input
                placeholder="Nome do corte"
                bg="gray.900"
                mb={3}
                size="lg"
                type="text"
                w="100%"
                disabled={subscription?.status !== "active"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Valor do corte ex: R$78.90"
                bg="gray.900"
                mb={3}
                size="lg"
                type="number"
                w="100%"
                disabled={subscription?.status !== "active"}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <Stack alignItems="center" direction="row" mb={6} mt={3}>
                <Switch
                  colorScheme="red"
                  size="lg"
                  disabled={subscription?.status !== "active"}
                  value={disableHaircut}
                  isChecked={disableHaircut === "disabled" ? false : true}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChangeStatus(e)
                  }
                />
                <Text fontWeight="bold" pl="8px">
                  {!status ? "Corte desativado" : "Corte ativado"}
                </Text>
              </Stack>

              <Button
                bg="button.cta"
                w="100%"
                color="gray.900"
                mb={4}
                _hover={{ bg: "#ffb13e" }}
                disabled={subscription?.status !== "active"}
                onClick={handleUptade}
              >
                Salvar
              </Button>

              {subscription?.status !== "active" && (
                <Flex
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Link href="/planos">
                    <Text fontWeight="bold" color="#31fb6a" cursor="pointer">
                      Seja Premium
                    </Text>
                  </Link>
                  <Text ml={1}>e tenha acesso liberado.</Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const { id } = ctx.params;
  try {
    const apiClient = setupAPIClient(ctx);

    const check = await apiClient.get("/haircut/check");

    const response = await apiClient.get("/haircut/detail", {
      params: {
        haircut_id: id,
      },
    });

    return {
      props: {
        haircut: response.data,
        subscription: check.data?.subscriptions,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        destination: "/haircuts",
        permanent: false,
      },
    };
  }
});
