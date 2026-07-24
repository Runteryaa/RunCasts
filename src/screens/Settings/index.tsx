import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChevronRight, ArrowLeft } from 'lucide-react-native';

export default function SettingsScreen({ navigation }: any) {
  const [language, setLanguage] = useState('Türkçe');
  const [country, setCountry] = useState('Türkiye');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Ayarlar</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dil Seçimi</Text>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>{language}</Text>
            <ChevronRight color="#9CA3AF" size={20} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>Ülke Seçimi</Text>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>{country}</Text>
            <ChevronRight color="#9CA3AF" size={20} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
  },
  backBtn: {
    padding: 4
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827'
  },
  content: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1'
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
  },
  settingLabel: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500'
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 8
  }
});
