import React, { useState, useMemo } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function sum(array) {
  return array.reduce((total, item) => total + item, 0);
}

export default function App() {
  const [entries, setEntries] = useState([{ calories: 0 }]);

  const [current7EntryWindowIndex, setCurrent7EntryWindowIndex] = useState(0);

  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [editingEntryValue, setEditingEntryValue] = useState(0);

  const [caloricLimit, setCaloricLimit] = useState(2000);

  const addNewEntry = () => {
    const newEntry = { calories: 0 };
    const newEntryIndex = entries.length;

    setEntries([...entries, newEntry]);
    setCurrentEntryIndex(newEntryIndex);
    setEditingEntryValue(0);

    // Move to the page in the table that will host the new entry
    setCurrent7EntryWindowIndex(Math.floor(newEntryIndex / 7));
  };

  const applyCaloricChange = () => {
    const newEntries = [...entries];

    newEntries[currentEntryIndex] = { ...newEntries[currentEntryIndex], calories: editingEntryValue };

    setEntries(newEntries);
  };

  const changeCurrentEntry = direction => {
    const newEntryIndex = currentEntryIndex + direction;

    setCurrentEntryIndex(newEntryIndex);
    setEditingEntryValue(entries[newEntryIndex].calories);
    setCurrent7EntryWindowIndex(Math.floor(newEntryIndex / 7));
  };

  const sevenEntryWindowCount = Math.floor(entries.length / 7) + 1;

  const [sevenEntryWindow, sevenEntryWindowCaloricStatus] = useMemo(() => {
    const sevenEntryWindow = entries.slice(current7EntryWindowIndex * 7, (current7EntryWindowIndex + 1) * 7);

    const sevenEntryWindowCaloricStatus = sum(sevenEntryWindow.map(({ calories }) => calories - caloricLimit));

    return [sevenEntryWindow, sevenEntryWindowCaloricStatus];
  }, [entries, current7EntryWindowIndex]);

  const [inDeficitCount, inSurplusCount] = useMemo(() => {
    let inDeficitCount = 0;
    let inSurplusCount = 0;

    for (const entry of entries) {
      if (entry.calories <= caloricLimit) {
        inDeficitCount++;
      } else {
        inSurplusCount++;
      }
    }

    return [inDeficitCount, inSurplusCount];
  }, [entries, caloricLimit]);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Caloric Intake Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Button onClick={() => setCurrent7EntryWindowIndex(idx => idx - 1)} disabled={current7EntryWindowIndex === 0}>
              Previous
            </Button>
            <Button
              onClick={() => setCurrent7EntryWindowIndex(idx => idx + 1)}
              disabled={current7EntryWindowIndex === sevenEntryWindowCount - 1}
            >
              Next
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entry</TableHead>
                <TableHead>Calories</TableHead>
                <TableHead>Deficit/Surplus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sevenEntryWindow.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{current7EntryWindowIndex * 7 + index + 1}</TableCell>
                  <TableCell>{entry.calories} kcal</TableCell>
                  <TableCell>
                    {entry.calories < caloricLimit ? (
                      <span className="text-green-500">-{caloricLimit - entry.calories}</span>
                    ) : (
                      <span className="text-red-500">+{entry.calories - caloricLimit}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <strong>
                    {sevenEntryWindowCaloricStatus <= 0 ? (
                      <>
                        Deficit: <span className="text-green-500">{sevenEntryWindowCaloricStatus}</span>
                      </>
                    ) : (
                      <>
                        Surplus: <span className="text-red-500">+{sevenEntryWindowCaloricStatus}</span>
                      </>
                    )}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="mt-6">
            <Label>Editing entry {currentEntryIndex + 1}</Label>
            <Input
              type="number"
              value={editingEntryValue === 0 ? '' : editingEntryValue}
              min={0}
              onChange={event => setEditingEntryValue(parseInt(event.target.value, 10) || 0)}
            />
            <div className="flex justify-between mt-2">
              <div>
                <Button onClick={() => changeCurrentEntry(-1)} disabled={currentEntryIndex === 0}>
                  Previous Entity
                </Button>
                <Button className="ml-1" onClick={() => changeCurrentEntry(1)} disabled={currentEntryIndex === entries.length - 1}>
                  Next Entity
                </Button>
              </div>
              <Button onClick={applyCaloricChange}>Apply</Button>
            </div>
            <div className="flex mt-2 mb-4">
              <Button onClick={addNewEntry}>Add New Entry</Button>
            </div>
            <Label>Caloric Limit</Label>
            <Input type="number" value={caloricLimit} min={0} onChange={event => setCaloricLimit(parseInt(event.target.value, 10) || 0)} />
            <p className="mt-4">
              <strong>Entries in Deficit:</strong> {inDeficitCount}
              <br />
              <strong>Entries in Surplus:</strong> {inSurplusCount}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
