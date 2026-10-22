#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <UniversalTelegramBot.h>
#include <ArduinoJson.h>

// 🔹 Your WiFi details
const char* WIFI_SSID = "Galaxy M34 5G B04E";
const char* WIFI_PASSWORD = "#@$@$87493";

// 🔹 Telegram Bot details
const char* BOT_TOKEN = "8351178531:AAHvZoPLV7VIWHxIMpl7hNVZudCsHe_zPrE";
const char* CHAT_ID = "6687972945";  // No spaces!

// 🔹 Pin configuration
#define BUTTON_PIN 2   // back to your original D2
#define LED_PIN    4

WiFiClientSecure client;
UniversalTelegramBot bot(BOT_TOKEN, client);

bool demoDone = false;
bool buttonPressed = false;

void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;

  Serial.println("📶 Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ Connected to WiFi!");
  } else {
    Serial.println("\n❌ Failed to connect to WiFi");
  }

  client.setInsecure();
}

void sendPanicMessage() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  WiFiClientSecure newClient;
  newClient.setInsecure();
  UniversalTelegramBot newBot(BOT_TOKEN, newClient);

  if (newBot.sendMessage(CHAT_ID, "🚨 Panic Alert! Please check immediately!", "")) {
    Serial.println("✅ Message sent to Telegram");
  } else {
    Serial.println("❌ Failed to send message");
  }
}

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(115200);

  connectWiFi();
  delay(1000);
  Serial.println("System Ready ✅");
  Serial.println("Press the Panic Button to trigger alert!");


  delay(10000);  
  if (!demoDone) {
    for (int i = 0; i < 15; i++) {  
      Serial.println("🚨 Panic button pressed! (Simulated)");
      digitalWrite(LED_PIN, HIGH);
      sendPanicMessage();
      delay(15000); 
    }
    digitalWrite(LED_PIN, LOW);
    demoDone = true;
    
  }
}

void loop() {
  // You can still press manually — won't affect demo
  int buttonState = digitalRead(BUTTON_PIN);

  if (buttonState == LOW && !buttonPressed) {
    buttonPressed = true;
    Serial.println("🚨 Panic button pressed!");
    digitalWrite(LED_PIN, HIGH);
    sendPanicMessage();
    delay(2000);
  } else if (buttonState == HIGH) {
    buttonPressed = false;
    digitalWrite(LED_PIN, LOW);
  }
}
