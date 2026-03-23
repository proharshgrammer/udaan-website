import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

export function useCollection(collectionName, constraints = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Serialize constraints to string to safely use in dependency array without infinite loops
  const constraintsStr = JSON.stringify(constraints.map(c => c.type ? { type: c.type } : c));
  
  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);
    const unsub = onSnapshot(q,
      snap => { 
        setData(snap.docs.map(d => ({ id: d.id, ...d.data() }))); 
        setLoading(false); 
      },
      err => { 
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err); 
        setLoading(false); 
      }
    );
    return unsub;
  }, [collectionName, constraintsStr]);

  return { data, loading, error };
}
