import { Button, Flex, Heading, Input, Select, Text } from "@chakra-ui/react";
import Head from "next/head";
import { Sidebar } from "../../components/sidebar";
import { ChangeEvent, useState } from "react";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

interface HaircutsProps {
  id: string;
  name: string;
  price: string | number;
  status: boolean;
  user_id: string;
}

interface NewProps {
  haircuts: HaircutsProps[];
}

export default function New({ haircuts }: NewProps) {
  const [customer, setCustomer] = useState("");
  const [haircutSelected, setHaircutSelected] = useState(haircuts[0]);
  const router = useRouter();

  function handleChangeSelect(id: string) {
    const haircutItem = haircuts.find((item) => item.id === id);
    setHaircutSelected(haircutItem);
  }

  async function handleRegister() {
    if (customer === "" || !haircutSelected) {
      toast.warning("Preencha o nome do cliente");
      return;
    }

    try {
      const apiClient = setupAPIClient();

      await apiClient.post("/schedule", {
        customer: customer,
        haircut_id: haircutSelected?.id,
      });

      router.push("/dashboard");
      setTimeout(() => toast.success("Cliente adicionado com sucesso!"), 1);
    } catch (error) {
      toast.error("Ops! Algo deu errado.");
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>BarberPRO - Novo agendamento</title>
      </Head>

      <Sidebar>
        <Flex direction="column" align="flex-start" justify="flex-start">
          <Flex
            direction="row"
            w="100%"
            align="center"
            justify="flex-start"
            mb={5}
            color="orange.900"
          >
            <Heading fontSize="3xl" mt={4}>
              Novo cliente
            </Heading>
          </Flex>

          <Flex
            maxW="700px"
            pb={8}
            pt={8}
            w="100%"
            direction="column"
            align="center"
            justify="center"
            bg="barber.400"
          >
            <Input
              placeholder="Nome do cliente"
              w="85%"
              type="text"
              size="lg"
              mb={5}
              bg="barber.900"
              value={customer}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCustomer(e.target.value)
              }
            />
            {haircutSelected && (
              <Select
                mb={5}
                size="lg"
                w="85%"
                bg="barber.900"
                onChange={(e) => handleChangeSelect(e.target.value)}
              >
                {haircuts.map((item) => (
                  <option
                    value={item?.id}
                    key={item?.id}
                    style={{
                      background: "#242222",
                    }}
                  >
                    {item?.name}
                  </option>
                ))}
              </Select>
            )}

            <Button
              size="lg"
              w="85%"
              bg="button.cta"
              color="gray.800"
              fontWeight="bold"
              _hover={{
                bg: "#ffb13e",
              }}
              onClick={handleRegister}
            >
              Cadastrar
            </Button>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/haircuts", {
      params: {
        status: true,
      },
    });

    if (response.data === null) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return {
      props: {
        haircuts: response.data,
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
