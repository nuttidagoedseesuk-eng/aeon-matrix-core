import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';

// โครงสร้างประเภทสัญญาณชีพ (Telemetry Interface) ที่สอดคล้องกับธรรมนูญระบบ
interface AgentStatus {
  id: string;
  name: string;
  status: 'OPERATIONAL' | 'LOW_CONFIDENCE' | 'CONFLICT_DETECTED' | 'ESCALATION_REQUIRED';
  lastReport: string;
}

const MobileActiveIncidentScreen = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([
    { id: '1', name: 'Inventory_AI', status: 'OPERATIONAL', lastReport: 'Stock levels stable' },
    { id: '2', name: 'QC_AI', status: 'LOW_CONFIDENCE', lastReport: 'Sensor Unreliable / High Noise' },
    { id: '3', name: 'Guardian_AI', status: 'CONFLICT_DETECTED', lastReport: 'Agent Conflict detected in Pipeline' },
  ]);

  const handleManualOverride = (agentName: string) => {
    Alert.alert("Manual Override", `คุณต้องการเข้าควบคุม ${agentName} ด้วยตัวเองใช่หรือไม่?`, [
      { text: "ยกเลิก" },
      { text: "ยืนยันการควบคุม", onPress: () => console.log(`Manual mode activated for ${agentName}`) }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🌌 AEON-MATRIX CONTROL</Text>
      <ScrollView>
        {agents.map((agent) => (
          <View key={agent.id} style={styles.card}>
            <Text style={styles.agentName}>{agent.name}</Text>
            <Text style={[styles.status, { color: agent.status === 'OPERATIONAL' ? 'green' : 'red' }]}>
              สถานะ: {agent.status}
            </Text>
            <Text style={styles.report}>{agent.lastReport}</Text>
            
            {agent.status !== 'OPERATIONAL' && (
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => handleManualOverride(agent.name)}
              >
                <Text style={styles.buttonText}>Manual Override</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { color: '#0ff', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#111', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  agentName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  status: { fontSize: 14, marginVertical: 5 },
  report: { color: '#aaa', fontSize: 12, marginBottom: 10 },
  button: { backgroundColor: '#d00', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

export default MobileActiveIncidentScreen;

