import { useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

// Muzik2Go Android companion shell (preview). Loads the production web app.
// Requires internet. On-device recording arrives with the future native build.
const HOME_URL = "https://web-one-xi-90.vercel.app";

export default function App() {
  const [loading, setLoading] = useState(true);
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.bar}>
        <Text style={styles.title}>Muzik2Go</Text>
      </View>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0AC8FF" />
          <Text style={styles.hint}>Opening your studio…</Text>
        </View>
      )}
      <WebView
        source={{ uri: HOME_URL }}
        style={styles.web}
        onLoadEnd={() => setLoading(false)}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#121A26" },
  bar: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#3A4A66" },
  title: { color: "#F2F5F9", fontWeight: "800", fontSize: 16 },
  loader: { padding: 24, alignItems: "center" },
  hint: { color: "#C7CDD6", marginTop: 8 },
  web: { flex: 1 },
});
