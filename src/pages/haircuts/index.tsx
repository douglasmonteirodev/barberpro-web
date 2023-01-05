import {
  Button,
  Flex,
  Heading,
  Stack,
  Switch,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { Sidebar } from "../../components/sidebar";

import { IoMdPricetag } from "react-icons/io";

export default function Haircuts() {
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  return (
    <>
      <Head>
        <title>Modelos de cortes - Minha barbearia</title>
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
            alignItems={isMobile ? "column" : "center"}
            justifyContent="flex-start"
          >
            <Heading
              fontSize={isMobile ? "28px" : "3xl"}
              mt={4}
              mb={4}
              mr={4}
              color="orange.900"
            >
              Modelos de cortes
            </Heading>

            <Link href="/haircuts/new">
              <Button bg="gray.700">Cadastrar novo</Button>
            </Link>

            <Stack ml="auto" alignItems="center" direction="row">
              <Text fontWeight="bold">ATIVOS</Text>
              <Switch colorScheme="green" size="lg" />
            </Stack>
          </Flex>

          <Link href="/haircuts/123" legacyBehavior>
            <Flex
              cursor="pointer"
              width="100%"
              p={4}
              bg="barber.400"
              direction="row"
              rounded={4}
              mb={2}
              justifyContent="space-between"
            >
              <Flex direction="row" alignItems="center" justifyContent="center">
                <IoMdPricetag size={28} color="#fba931" />
                <Text fontWeight="bold" ml={4} noOfLines={2}>
                  Degradê
                </Text>
              </Flex>

              <Text fontWeight="bold" color="#fff">
                Preço: R$ 49.99
              </Text>
            </Flex>
          </Link>
        </Flex>
      </Sidebar>
    </>
  );
}
