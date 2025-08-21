class CustomStack {
public:
    vector<int>v;
    int n;
    CustomStack(int maxSize) {
        n=maxSize;
    }
    
    void push(int x) {
        if(v.size()==n)
            return;
        v.push_back(x);
    }
    
    int pop() {
        if(v.empty())
            return -1;
        int p=v[v.size()-1];
        v.pop_back();
        return p;
    }
    
    void increment(int k, int val) {
        int t;
        if(v.size()>=k)
             t=k;
        else 
            t=v.size();
        for(int i=0;i<t;i++){
            v[i]+=val;
        }
    }
};

/**
 * Your CustomStack object will be instantiated and called as such:
 * CustomStack* obj = new CustomStack(maxSize);
 * obj->push(x);
 * int param_2 = obj->pop();
 * obj->increment(k,val);
 */