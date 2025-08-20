class RandomizedSet {

Set<Integer> set = new HashSet<Integer> ();
    public RandomizedSet() {
        Set<Integer> set = new HashSet<Integer> ();
    }
    
    public boolean insert(int val) {
        if(set.contains(val))
        return false;
        set.add(val);
        return true;
    }
    
    public boolean remove(int val) {
        if(!set.contains(val))
        return false;
        set.remove(val);
        return true;
    }
    
    public int getRandom() {

 Integer[] arrayNumbers = set.toArray(new Integer[set.size()]); 
  
        // generate a random number 
        Random rndm = new Random(); 
  
        // this will generate a random number between 0 and 
        // HashSet.size - 1 
        int rndmNumber = rndm.nextInt(set.size()); 
  
        // // get the element at random number index 
        // System.out.println("Random element: "
        //                    + arrayNumbers[rndmNumber]); 


        return arrayNumbers[rndmNumber];
    }
}

/**
 * Your RandomizedSet object will be instantiated and called as such:
 * RandomizedSet obj = new RandomizedSet();
 * boolean param_1 = obj.insert(val);
 * boolean param_2 = obj.remove(val);
 * int param_3 = obj.getRandom();
 */