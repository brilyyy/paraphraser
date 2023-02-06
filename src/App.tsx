import { createSignal } from "solid-js";
import { Command } from "@tauri-apps/api/shell";
import {
  Box,
  Button,
  Center,
  Text,
  Textarea,
  VStack,
  notificationService,
} from "@hope-ui/solid";

async function paraphrase(text: string) {
  const clean = text.replace(/"/g, '"').replace(/'/g, "'");
  const command = Command.sidecar("bin/python/main", clean);
  const output = await command.execute();
  return output;
}

function App() {
  const [result, setResult] = createSignal("");
  const [text, setText] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  //
  return (
    <Box p="$4">
      <VStack mb="$5">
        <Text size="2xl" fontWeight="$bold">
          Paraphraser
        </Text>
        <Text color="$danger10">
          Parafrase ini belum 100% sempurna, silakan ubah hasil agar lebih bisa
          dibaca!
        </Text>
      </VStack>
      <Textarea
        textAlign="justify"
        my="$2"
        value={text()}
        size="lg"
        rows={10}
        onInput={(e) => setText(e.currentTarget.value)}
      />
      <Center>
        <Button
          loading={loading()}
          onClick={async () => {
            setLoading(true);
            const { stdout } = await paraphrase(text());
            setResult(stdout);
            if (stdout) {
              notificationService.show({
                status: "success",
                title: "Sukses!",
                description: "Sukses memparafrase",
              });
            } else {
              notificationService.show({
                status: "danger",
                title: "Error!",
                description: "Gagal memparafrase",
              });
            }

            setLoading(false);
          }}
        >
          Paraphrase
        </Button>
      </Center>
      <Textarea
        textAlign="justify"
        my="$2"
        size="lg"
        value={result()}
        rows={10}
        readOnly
      />
      <Text textAlign="center">
        <a href="https://brilyyy.github.io" target="_blank">
          &copy; 2023 brilyan.dev
        </a>
      </Text>
    </Box>
  );
}

export default App;
