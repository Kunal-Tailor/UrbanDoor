/**
 * HomeScreen.js — Customer home screen
 * Shows greeting, search bar, categories, featured services, and popular providers.
 */
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList, Image, RefreshControl, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { SIZES } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES, SERVICES, PROVIDERS } from '../../constants/mockData';
import ServiceCard from '../../components/ServiceCard';
import { getGreeting } from '../../utils/helpers';

const HomeScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const featuredServices = SERVICES.slice(0, 5);
  const nearbyProviders = PROVIDERS.filter(p => p.isOnline).slice(0, 4);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('ServiceList', { searchQuery: searchQuery.trim() });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.userName}>{userData?.name || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.notifButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textTertiary} />
          <TextInput style={styles.searchInput} placeholder="Search for services..." placeholderTextColor={COLORS.textTertiary}
            value={searchQuery} onChangeText={setSearchQuery} onSubmitEditing={handleSearch} returnKeyType="search" />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}><Ionicons name="close-circle" size={20} color={COLORS.textTertiary} /></TouchableOpacity>
          ) : null}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryChip}
                onPress={() => navigation.navigate('ServiceList', { category: cat.name, categoryId: cat.id })} activeOpacity={0.7}>
                <View style={[styles.categoryIcon, { backgroundColor: cat.color + '15' }]}>
                  <Ionicons name={cat.icon} size={22} color={cat.color} />
                </View>
                <Text style={styles.categoryLabel}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Services</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ServiceList', {})}><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          <FlatList data={featuredServices} horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 6 }}
            renderItem={({ item }) => (
              <ServiceCard service={item} onPress={() => navigation.navigate('ServiceDetail', { service: item })} />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* Popular Providers */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <Text style={styles.sectionTitle}>Popular Providers Near You</Text>
          {nearbyProviders.map((provider) => (
            <TouchableOpacity key={provider.id} style={styles.providerCard} activeOpacity={0.7}>
              <Image source={{ uri: provider.profileImage }} style={styles.providerImage} />
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <Text style={styles.providerService}>{provider.services.join(', ')}</Text>
                <View style={styles.providerMeta}>
                  <Ionicons name="star" size={13} color={COLORS.secondary} />
                  <Text style={styles.providerRating}>{provider.rating}</Text>
                  <Text style={styles.providerJobs}>• {provider.completedJobs} jobs</Text>
                </View>
              </View>
              <View style={[styles.onlineBadge, { backgroundColor: provider.isOnline ? COLORS.successLight : COLORS.divider }]}>
                <View style={[styles.onlineDot, { backgroundColor: provider.isOnline ? COLORS.success : COLORS.textTertiary }]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 16, paddingBottom: 8 },
  greeting: { fontSize: 14, color: COLORS.textSecondary },
  userName: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginTop: 2 },
  notifButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 3 },
  notifDot: { position: 'absolute', top: 10, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, margin: 20, marginTop: 16, paddingHorizontal: 16, borderRadius: 14, height: 50, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 3 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.textPrimary },
  section: { marginTop: 8, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, paddingHorizontal: 20, marginBottom: 14 },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  categoriesRow: { paddingLeft: 20, paddingRight: 8 },
  categoryChip: { alignItems: 'center', marginRight: 16, width: 72 },
  categoryIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  categoryLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary, textAlign: 'center' },
  providerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, marginHorizontal: 20, marginBottom: 10, padding: 14, borderRadius: 14, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 4, elevation: 2 },
  providerImage: { width: 48, height: 48, borderRadius: 14, marginRight: 12 },
  providerInfo: { flex: 1 },
  providerName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  providerService: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  providerMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  providerRating: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary, marginLeft: 4 },
  providerJobs: { fontSize: 12, color: COLORS.textTertiary, marginLeft: 6 },
  onlineBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  onlineDot: { width: 10, height: 10, borderRadius: 5 },
});

export default HomeScreen;
