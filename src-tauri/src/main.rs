#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use tauri::api::process::Command;
mod commands;
fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            tauri::async_runtime::spawn(async move {
                let (mut _rx, mut _child) = Command::new_sidecar("chromedriver")
                    .expect("failed to setup `chromedriver` sidecar")
                    .args(["--port=2711"])
                    .spawn()
                    .expect("Failed to spawn packaged node");
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![commands::paraphrase])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
