import { createSignal, onMount, Show } from "solid-js";
import { Command } from "@tauri-apps/api/shell";
import {
  Box,
  Button,
  Text,
  Textarea,
  VStack,
  notificationService,
  createDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Heading,
} from "@hope-ui/solid";
import logo from "./assets/logo.png";
import pkg from "../package.json";
import trakteerBtn from "./assets/trbtn-red-1.png";

function App() {
  const [result, setResult] = createSignal("");
  const [text, setText] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const { isOpen, onClose, onOpen } = createDisclosure({
    defaultIsOpen: true,
  });

  async function paraphrase(text: string) {
    const clean = text.replace(/"/g, '"').replace(/'/g, "'");
    const command = Command.sidecar("bin/rust_paraphrase", `--text=${clean}`);
    const output = await command.execute();
    return output;
  }

  async function onButtonClick(e: Event) {
    setLoading(true);
    try {
      const { stdout } = await paraphrase(text());

      setResult(stdout.replace(/\s+/g, " ").trim());

      notificationService.show({
        status: "success",
        title: "Sukses!",
        description: "Sukses memparafrase",
      });
    } catch (e) {
      notificationService.show({
        status: "danger",
        title: "Error!",
        description: "Gagal memparafrase",
      });
    } finally {
      setLoading(false);
    }
  }
  //
  return (
    <>
      <Box p="$4">
        <VStack mb="$5">
          <Text size="2xl" fontWeight="$bold">
            Parafrase 🚀
          </Text>
          <Text color="$danger10" fontWeight="$semibold">
            Parafrase ini belum 100% sempurna, baca lagi hasilnya, trs improve
            deh
          </Text>
        </VStack>
        <Textarea
          textAlign="justify"
          my="$2"
          value={text()}
          size="lg"
          placeholder="teks minimal 20 karakter"
          rows={10}
          onInput={(e) => setText(e.currentTarget.value)}
        />
        <VStack gap="$2">
          <Button
            loading={loading()}
            loadingText="tunggu... maapin y kalo lama 🗿"
            disabled={!text() || text().length < 20}
            onClick={onButtonClick}
          >
            Paraphrase
          </Button>
          <Show when={loading()}>
            <Text color="$info10">
              🌈 kalo hasilnya gada klik parafrase lagi aja 🌈
            </Text>
          </Show>
        </VStack>
        <Textarea
          textAlign="justify"
          my="$2"
          size="lg"
          value={result()}
          rows={10}
          readOnly
        />
        <Text textAlign="center">
          <Button onClick={onOpen} variant="ghost">
            &copy; 2023 brilyan.dev
          </Button>
        </Text>
      </Box>
      <Modal
        centered
        opened={isOpen()}
        closeOnOverlayClick={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap="$2" my="$3">
              <img src={logo} width="150" alt="" />
              <Heading level="2">v{pkg.version}</Heading>
              <Heading mb="$3">makasi sawerannya kk ☺️</Heading>
              <a href="https://teer.id/brilyan.dev" target="_blank">
                <img
                  id="wse-buttons-preview"
                  src={trakteerBtn}
                  height="40"
                  style="border:0px;height:40px;"
                  alt="Trakteer Saya"
                />
              </a>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default App;
