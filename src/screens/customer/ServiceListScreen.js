/**
 * ServiceListScreen.js — List of services filtered by category
 * Supports search, filter, and sort functionality.
 */
import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { SERVICES } from '../../constants/mockData';
import ServiceCard from '../../components/ServiceCard';
import Header from '../../components/Header';
import EmptyState from '../../components/EmptyState';

const ServiceListScreen = ({ route, navigation }) => {
  const { category, categoryId, searchQuery: initialSearch } = route.params || {};
  const [search, setSearch] = useState(initialSearch || '');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'priceLow' | 'priceHigh'
  const [showSort, setShowSort] = useState(false);

  const filteredServices = useMemo(() => {
    let list = [...SERVICES];
    if (categoryId) list = list.filter(s => s.categoryId === categoryId);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'priceLow') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'priceHigh') list.sort((a, b) => b.price - a.price);
    return list;
  }, [categoryId, search, sortBy]);

  const sortOptions = [
    { key: 'rating', label: 'Highest Rated', icon: 'star' },
    { key: 'priceLow', label: 'Price: Low to High', icon: 'arrow-up' },
    { key: 'priceHigh', label: 'Price: High to Low', icon: 'arrow-down' },
  ];

  return (
    <View style={styles.container}>
      <Header title={category || 'All Services'} onBack={() => navigation.goBack()} />

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.textTertiary} />
          <TextInput style={styles.searchInput} placeholder="Search services..." value={search} onChangeText={setSearch} placeholderTextColor={COLORS.textTertiary} />
        </View>
        <TouchableOpacity style={styles.sortButton} onPress={() => setShowSort(!showSort)}>
          <Ionicons name="funnel-outline" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {showSort && (
        <View style={styles.sortPanel}>
          {sortOptions.map(opt => (
            <TouchableOpacity key={opt.key} style={[styles.sortOption, sortBy === opt.key && styles.sortActive]}
              onPress={() => { setSortBy(opt.key); setShowSort(false); }}>
              <Ionicons name={opt.icon} size={16} color={sortBy === opt.key ? COLORS.primary : COLORS.textSecondary} />
              <Text style={[styles.sortLabel, sortBy === opt.key && styles.sortLabelActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.resultCount}>{filteredServices.length} services found</Text>

      <FlatList data={filteredServices} keyExtractor={item => item.id} contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="search-outline" title="No services found" message="Try a different search or category" />}
        renderItem={({ item }) => (
          <ServiceCard service={item} variant="horizontal" onPress={() => navigation.navigate('ServiceDetail', { service: item })} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: COLORS.textPrimary },
  sortButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.primarySoft, alignItems: 'center', justifyContent: 'center' },
  sortPanel: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8, gap: 8 },
  sortOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  sortActive: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.primary },
  sortLabel: { fontSize: 12, color: COLORS.textSecondary, marginLeft: 4 },
  sortLabelActive: { color: COLORS.primary, fontWeight: '600' },
  resultCount: { fontSize: 13, color: COLORS.textTertiary, paddingHorizontal: 16, marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
});

export default ServiceListScreen;
