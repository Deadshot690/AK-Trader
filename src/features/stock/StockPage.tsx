import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store';
import { StockItem, StockCategory, StockMovement } from '../../types';
import {
  Layers,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Package,
  History,
  TrendingDown,
  Warehouse,
  CheckCircle2,
  Download
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { Tabs } from '../../components/common/Tabs';

export const StockPage: React.FC = () => {
  const { stock, stockMovements, addStockItem, updateStockQuantity, addStockMovement, addToast } =
    useAppStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'movements'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Modals
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isGRNModalOpen, setIsGRNModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // Form State: Add Item
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<StockCategory>('Puja Samagri');
  const [qtyOnHand, setQtyOnHand] = useState('20');
  const [unit, setUnit] = useState('Kg');
  const [minThreshold, setMinThreshold] = useState('10');
  const [unitPrice, setUnitPrice] = useState('500');
  const [location, setLocation] = useState('Central Godown Bay 1');

  // Form State: GRN
  const [grnItemCode, setGrnItemCode] = useState(stock[0]?.itemCode || '');
  const [grnQty, setGrnQty] = useState('50');
  const [grnSupplier, setGrnSupplier] = useState('');

  // Form State: Issue
  const [issueItemCode, setIssueItemCode] = useState(stock[0]?.itemCode || '');
  const [issueQty, setIssueQty] = useState('5');
  const [issueDept, setIssueDept] = useState('Kitchen Central Cookhouse');

  // Computed metrics
  const totalItemsCount = stock.length;
  const totalValuation = stock.reduce((sum, item) => sum + item.quantityOnHand * item.unitPrice, 0);
  const lowStockItems = stock.filter((item) => item.quantityOnHand <= item.minThreshold);

  const filteredStock = useMemo(() => {
    return stock.filter((item) => {
      const matchSearch =
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchLowStock = !showLowStockOnly || item.quantityOnHand <= item.minThreshold;

      return matchSearch && matchCategory && matchLowStock;
    });
  }, [stock, searchQuery, categoryFilter, showLowStockOnly]);

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    addStockItem({
      itemName,
      category,
      quantityOnHand: Number(qtyOnHand) || 0,
      unit,
      minThreshold: Number(minThreshold) || 10,
      unitPrice: Number(unitPrice) || 100,
      location,
    });

    setIsAddItemModalOpen(false);
    setItemName('');
  };

  const handleSaveGRN = (e: React.FormEvent) => {
    e.preventDefault();
    const targetItem = stock.find((s) => s.itemCode === grnItemCode);
    if (!targetItem) return;

    addStockMovement({
      movementType: 'GRN (Receipt)',
      itemCode: targetItem.itemCode,
      itemName: targetItem.itemName,
      quantity: Number(grnQty) || 1,
      source: grnSupplier || 'Registered Mandi Vendor',
      destination: targetItem.location,
      referenceNumber: `GRN-${Date.now().toString().slice(-4)}`,
      authorizedBy: 'Ahmed',
    });

    setIsGRNModalOpen(false);
    setGrnQty('50');
    setGrnSupplier('');
  };

  const handleSaveIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const targetItem = stock.find((s) => s.itemCode === issueItemCode);
    if (!targetItem) return;

    const requested = Number(issueQty) || 1;
    if (requested > targetItem.quantityOnHand) {
      addToast({
        type: 'error',
        title: 'Stock Exceeded',
        message: `Only ${targetItem.quantityOnHand} ${targetItem.unit} available in stock.`,
      });
      return;
    }

    addStockMovement({
      movementType: 'Issue',
      itemCode: targetItem.itemCode,
      itemName: targetItem.itemName,
      quantity: requested,
      source: targetItem.location,
      destination: issueDept,
      referenceNumber: `ISS-${Date.now().toString().slice(-4)}`,
      authorizedBy: 'Vikram Joshi',
    });

    setIsIssueModalOpen(false);
    setIssueQty('5');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E4E9E4] dark:border-[#27322A]">
        <div>
          <h2 className="text-xl font-bold text-[#1F2722] dark:text-[#F0F5F1]">
            Inventory & Central Godown Stock
          </h2>
          <p className="text-xs text-[#68736C] dark:text-[#95A59A] mt-0.5">
            Real-time balance, threshold triggers, Goods Received Notes (GRN), and kitchen issue logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowDownLeft className="w-3.5 h-3.5" />}
            onClick={() => setIsGRNModalOpen(true)}
          >
            Receive Stock (GRN)
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            onClick={() => setIsIssueModalOpen(true)}
          >
            Issue to Dept
          </Button>
          <Button
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddItemModalOpen(true)}
          >
            New SKU Item
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Registered SKUs
          </span>
          <div className="text-lg font-black text-[#1F2722] dark:text-[#F0F5F1] mt-0.5">
            {totalItemsCount} Products
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Inventory Valuation
          </span>
          <div className="text-lg font-black text-[#344E41] dark:text-emerald-400 mt-0.5">
            ₹{(totalValuation / 100000).toFixed(2)} Lakhs
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Critical Low Stock
          </span>
          <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
            {lowStockItems.length} Warnings
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAFBF9] dark:bg-[#1E2621] border border-[#E4E9E4] dark:border-[#2C3830]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]">
            Stock Movements MTD
          </span>
          <div className="text-lg font-black text-[#1F2722] dark:text-[#F0F5F1] mt-0.5">
            {stockMovements.length} Transactions
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between">
        <Tabs
          tabs={[
            { id: 'inventory', label: 'Inventory Balances', count: stock.length },
            { id: 'movements', label: 'Audit Trail & GRN Movements', count: stockMovements.length },
          ]}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as any)}
        />

        {activeTab === 'inventory' && (
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1F2722] dark:text-[#F0F5F1]">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Show Low Stock Only ({lowStockItems.length})</span>
          </label>
        )}
      </div>

      {/* Tab 1: Current Stock */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Search and Category Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-[#FAFBF9] dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830]">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#68736C]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search item name, code, storage bay..."
                  className="w-full bg-white dark:bg-[#202923] border border-[#E4E9E4] dark:border-[#2C3830] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#1F2722] dark:text-[#F0F5F1] placeholder-[#68736C] focus:outline-none focus:ring-2 focus:ring-[#344E41]/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs text-[#68736C] font-semibold">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs rounded-xl bg-white dark:bg-[#202923] border border-[#E4E9E4] dark:border-[#2C3830] px-2.5 py-1.5 text-[#1F2722] dark:text-[#F0F5F1] focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Puja Samagri">Puja Samagri</option>
                <option value="Annakshetra Provisions">Annakshetra Provisions</option>
                <option value="Linen & Bedding">Linen & Bedding</option>
                <option value="Sanitation & Cleaning">Sanitation & Cleaning</option>
                <option value="Electrical & Hardware">Electrical & Hardware</option>
                <option value="Office Stationery">Office Stationery</option>
              </select>
            </div>
          </div>

          {filteredStock.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No Stock Items Found"
              description="No inventory items correspond to your filters."
              actionLabel="Add Stock Item"
              onAction={() => setIsAddItemModalOpen(true)}
            />
          ) : (
            <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl overflow-hidden bg-white dark:bg-[#1A211D] shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFBF9] dark:bg-[#161C18] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider font-semibold border-b border-[#E4E9E4] dark:border-[#2C3830]">
                    <tr>
                      <th className="py-3 px-4">Item Code</th>
                      <th className="py-3 px-4">Commodity / Item Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Quantity on Hand</th>
                      <th className="py-3 px-4">Threshold</th>
                      <th className="py-3 px-4">Estimated Value</th>
                      <th className="py-3 px-4">Storage Bay</th>
                      <th className="py-3 px-4 text-right">Quick Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E9E4] dark:divide-[#2C3830]">
                    {filteredStock.map((item) => {
                      const isLow = item.quantityOnHand <= item.minThreshold;
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-[#FAFBF9] dark:hover:bg-[#202923] transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                            {item.itemCode}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                              {item.itemName}
                            </div>
                            <div className="text-[10px] text-[#68736C] dark:text-[#95A59A]">
                              ₹{item.unitPrice} per {item.unit}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E7EDE8] text-[#24372E] dark:bg-[#202A24] dark:text-[#E7EDE8]">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm font-black ${
                                  isLow ? 'text-amber-600 dark:text-amber-400' : 'text-[#1F2722] dark:text-[#F0F5F1]'
                                }`}
                              >
                                {item.quantityOnHand} {item.unit}
                              </span>
                              {isLow && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 px-1.5 py-0.5 rounded-md">
                                  <AlertTriangle className="w-3 h-3" />
                                  Low
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-[#68736C] dark:text-[#95A59A]">
                            Min {item.minThreshold} {item.unit}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                            ₹{(item.quantityOnHand * item.unitPrice).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-[#68736C] dark:text-[#95A59A]">
                            {item.location}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => updateStockQuantity(item.id, -1)}
                                className="w-7 h-7 rounded-lg bg-[#FAFBF9] dark:bg-[#202923] border border-[#E4E9E4] dark:border-[#2C3830] text-sm font-bold hover:bg-[#E7EDE8] text-[#1F2722] dark:text-[#F0F5F1]"
                                title="Issue 1 unit"
                              >
                                -
                              </button>
                              <button
                                onClick={() => updateStockQuantity(item.id, 1)}
                                className="w-7 h-7 rounded-lg bg-[#FAFBF9] dark:bg-[#202923] border border-[#E4E9E4] dark:border-[#2C3830] text-sm font-bold hover:bg-[#E7EDE8] text-[#1F2722] dark:text-[#F0F5F1]"
                                title="Add 1 unit"
                              >
                                +
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Stock Movement Log */}
      {activeTab === 'movements' && (
        <div className="border border-[#E4E9E4] dark:border-[#2C3830] rounded-2xl overflow-hidden bg-white dark:bg-[#1A211D] shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBF9] dark:bg-[#161C18] text-[#68736C] dark:text-[#95A59A] uppercase tracking-wider font-semibold border-b border-[#E4E9E4] dark:border-[#2C3830]">
                <tr>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Commodity Item</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Origin / Supplier</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E9E4] dark:divide-[#2C3830]">
                {stockMovements.map((mvt) => (
                  <tr
                    key={mvt.id}
                    className="hover:bg-[#FAFBF9] dark:hover:bg-[#202923] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                      {mvt.referenceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={mvt.movementType} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1F2722] dark:text-[#F0F5F1]">
                      {mvt.itemName}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[#344E41] dark:text-emerald-400">
                      {mvt.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-[#68736C] dark:text-[#95A59A]">
                      {mvt.source}
                    </td>
                    <td className="py-3.5 px-4 text-[#1F2722] dark:text-[#F0F5F1]">
                      {mvt.destination}
                    </td>
                    <td className="py-3.5 px-4 text-[#68736C] dark:text-[#95A59A]">
                      {mvt.date}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#1F2722] dark:text-[#F0F5F1]">
                      {mvt.authorizedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: New Stock Item */}
      <Modal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        title="Register New Inventory SKU"
        subtitle="Add provisions, linen, or hardware to the inventory master"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddItemModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveItem}>
              Save Item
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveItem} className="space-y-4">
          <Input
            label="Item Description"
            placeholder="e.g. Sona Masoori Rice (Bags 25kg)"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Inventory Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              options={[
                { value: 'Puja Samagri', label: 'Puja Samagri' },
                { value: 'Annakshetra Provisions', label: 'Annakshetra Provisions' },
                { value: 'Linen & Bedding', label: 'Linen & Bedding' },
                { value: 'Sanitation & Cleaning', label: 'Sanitation & Cleaning' },
                { value: 'Electrical & Hardware', label: 'Electrical & Hardware' },
                { value: 'Office Stationery', label: 'Office Stationery' },
              ]}
            />
            <Input
              label="Measurement Unit"
              placeholder="e.g. Kg, Bags, Tins, Units"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Opening Quantity"
              type="number"
              value={qtyOnHand}
              onChange={(e) => setQtyOnHand(e.target.value)}
            />
            <Input
              label="Min Alert Threshold"
              type="number"
              value={minThreshold}
              onChange={(e) => setMinThreshold(e.target.value)}
            />
            <Input
              label="Unit Price (₹)"
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </div>

          <Input
            label="Storage Location / Bay"
            placeholder="e.g. Kitchen Central Grain Store / Godown Bay B"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </form>
      </Modal>

      {/* Modal: Goods Received Note (GRN) */}
      <Modal
        isOpen={isGRNModalOpen}
        onClose={() => setIsGRNModalOpen(false)}
        title="Record Goods Received Note (GRN)"
        subtitle="Inward receipt from suppliers, mandis, or donors"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsGRNModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveGRN}>
              Inward Stock & Update Balance
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveGRN} className="space-y-4">
          <Select
            label="Select Item Received"
            value={grnItemCode}
            onChange={(e) => setGrnItemCode(e.target.value)}
            options={stock.map((s) => ({
              value: s.itemCode,
              label: `${s.itemName} (Current: ${s.quantityOnHand} ${s.unit})`,
            }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Quantity Received"
              type="number"
              value={grnQty}
              onChange={(e) => setGrnQty(e.target.value)}
              required
            />
            <Input
              label="Supplier / Mandi Dealer"
              placeholder="e.g. Kisan Traders Mandi"
              value={grnSupplier}
              onChange={(e) => setGrnSupplier(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Modal: Issue Stock */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Stock to Department"
        subtitle="Disburse provisions to kitchen, sanctum, or dharamshala"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveIssue}>
              Confirm Outward Issue
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveIssue} className="space-y-4">
          <Select
            label="Select Item to Issue"
            value={issueItemCode}
            onChange={(e) => setIssueItemCode(e.target.value)}
            options={stock.map((s) => ({
              value: s.itemCode,
              label: `${s.itemName} (Available: ${s.quantityOnHand} ${s.unit})`,
            }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Quantity to Issue"
              type="number"
              value={issueQty}
              onChange={(e) => setIssueQty(e.target.value)}
              required
            />
            <Select
              label="Destination Department"
              value={issueDept}
              onChange={(e) => setIssueDept(e.target.value)}
              options={[
                { value: 'Kitchen Central Cookhouse', label: 'Kitchen Central Cookhouse' },
                { value: 'Main Sanctum Aarti Dept', label: 'Main Sanctum Aarti Dept' },
                { value: 'Dharamshala Housekeeping Depot', label: 'Dharamshala Housekeeping Depot' },
                { value: 'Gaushala Feed Stall', label: 'Gaushala Feed Stall' },
                { value: 'Sanitation Cell', label: 'Sanitation Cell' },
              ]}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
