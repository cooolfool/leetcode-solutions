class Solution {
public:
     bool validateStackSequences(vector<int>& pushed, vector<int>& popped) {
        auto indic=pushed.begin();
        for(int i=0;i<popped.size();i++)
        {
            if(popped[i]!=*indic)
            {
            indic=find(indic+1,pushed.end(),popped[i]);
            if(indic==pushed.end())
            return false;
            }
           // cout<<*indic<<"  ";
            if(popped[i]==*indic)
            {
                pushed.erase(indic);
                indic--;
                if(indic<pushed.begin())
                    indic=pushed.begin();
            }
            
        }
        return true;
    }
};