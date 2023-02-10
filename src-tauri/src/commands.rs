use std::path::Path;
use thirtyfour::prelude::*;

#[tauri::command]
pub async fn paraphrase(txt: String) -> String {
    let mut caps = DesiredCapabilities::chrome();

    // Adding ext
    let ext = Path::new("src/bypass.crx");
    caps.add_extension(ext).err();

    // set window sizea
    caps.add_chrome_arg("--window-size=800,800").err();

    // set headless
    caps.add_chrome_arg("--headless").err();

    let driver = WebDriver::new("http://localhost:2711", caps)
        .await
        .expect("msg");

    // Navigate to paraphrase.io.
    driver.goto("https://quillbot.com").await.expect("msg");

    // Getting element
    let text_input = driver
        .find(By::XPath("//*[@id=\"inputText\"]"))
        .await
        .expect("msg");

    let paraphrase_button = driver
        .find(By::XPath(
            "//*[@id=\"InputBottomQuillControl\"]/div/div/div/div[2]/div/div/div/div/button",
        ))
        .await
        .expect("msg");

    let text_output = driver
        .find(By::XPath("//*[@id=\"editable-content-within-article\"]"))
        .await
        .expect("msg");

    // let progress = driver
    //     .find(By::XPath("//*[@id=\"percent-suggested\"]"))
    //     .await
    //     .expect("msg");

    let id_to_en = translate(&txt, "id", "en").await;

    text_input.send_keys(id_to_en).await.expect("msg");

    paraphrase_button.click().await.expect("msg");

    paraphrase_button
        .wait_until()
        .has_text("Rephrase")
        .await
        .expect("msg");

    // progress.wait_until().has_text("100%").await.expect("msg");

    let output = text_output.text().await.expect("msg");

    let en_to_id = translate(&output, "en", "id").await;

    // Always explicitly close the browser.
    driver.quit().await.expect("msg");

    en_to_id
}

async fn translate(txt: &str, sl: &str, tl: &str) -> String {
    let mut caps = DesiredCapabilities::chrome();

    // Adding ext
    let ext = Path::new("src/lib/bypass.crx");
    caps.add_extension(ext).err();

    // set window size
    caps.add_chrome_arg("--window-size=500,500").err();

    // set headless
    caps.add_chrome_arg("--headless").err();

    let driver = WebDriver::new("http://localhost:2711", caps)
        .await
        .expect("msg");

    // escaping text for url
    let source_text = urlencoding::encode(txt);

    // Navigate to google translate.
    driver
        .goto(format!(
            "https://translate.google.com/?sl={sl}&tl={tl}&text={source_text}&op=translate"
        ))
        .await
        .expect("msg");

    // Getting element
    let progress = driver
        .find(By::XPath(
            "/html/body/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[1]",
        ))
        .await
        .expect("msg");

    progress.wait_until().not_displayed().await.expect("msg");
    let output_span = driver
        .find(By::XPath(
            "//*[@id=\"yDmH0d\"]/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[3]/c-wiz[2]/div/div[8]/div/div[1]/span[1]",
        ))
        .await.expect("msg");
    let output = output_span.text().await.expect("msg");

    // Always explicitly close the browser.
    driver.quit().await.expect("msg");

    output
}
